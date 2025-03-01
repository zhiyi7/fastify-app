'use strict';

import path from 'node:path';
import fastify from 'fastify';
import fastGlob from 'fast-glob';
import cors from '@fastify/cors';
import { execSync } from 'node:child_process';

/**
 * Custom error class for API errors.
 * @class ApiError
 * @extends Error
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {number} [statusCode=200] - HTTP status code
 * @param {Object} [data={}] - Additional error data
 */
class ApiError extends Error {
    constructor(message, code, statusCode = 200, data = {}) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.data = data;
        this.name = 'ApiError';
    }
}

/**
 * @typedef {Object} FastifyConfig
 * @property {Object} [fastify] - Fastify configuration options
 * @property {Object} [app] - Application specific configuration
 * @property {boolean} [app.disableCors] - Whether to disable CORS
 * @property {boolean} [app.disableLogRequestBody] - Whether to disable logging request body
 * @property {boolean} [app.disableLogRequestHeaders] - Whether to disable logging request headers
 * @property {boolean} [app.disableSendRequestIdHeader] - Whether to disable sending request ID in response headers
 * @property {boolean} [app.disableApiErrorHandler] - Whether to disable API error handler
 * @property {boolean} [app.disableLogApiError] - Whether to disable logging API errors
 * @property {boolean} [app.disableHealthCheckRoutes] - Whether to disable health check routes
 * @property {string} [app.healthCheckRoutesPrefix] - Prefix for health check routes
 * @property {boolean} [app.enableHealthCheckShowsGitRev] - Whether to show git revision in health check response
 * @property {boolean} [app.disableAddRequestState] - Whether to disable adding state object to request
 * @property {boolean} [app.disableReplyHelperFunctions] - Whether to disable reply helper functions
 * @property {number} [app.internalServerErrorCode] - Status code for internal server errors
 * @property {Object} [server] - Server configuration for listening
 */

let fastifyInstance;

/**
 * Initialize a new Fastify instance with configured plugins and hooks.
 * @param {FastifyConfig} config - Configuration object for the application
 * @returns {Object} Fastify instance with added methods
 */
async function init(config) {
    /************************************
     * Initialize fastify and put it in global
     ************************************/
    fastifyInstance = fastify(Object.assign({
        logger: true,
        trustProxy: true,
        disableRequestLogging: false,
        bodyLimit: 52428800, //in bytes, 50Mb
    }, config.fastify));

    /************************************
     * put config in app, freezed
     ************************************/
    Object.freeze(config);
    Object.defineProperty(fastifyInstance, 'config', { value: config });

    /************************************
     * Register cors plugin
     ************************************/
    if (!config.app?.disableCors) {
        fastifyInstance.register(cors);
    }

    /************************************
     * Log request body and headers
     ************************************/
    if (!config.app?.disableLogRequestBody || !config?.app?.disableLogRequestHeaders) {
        fastifyInstance.addHook('preHandler', (req, res, done) => {
            const logContent = { url: req.url };
            if (!config?.app?.disableLogRequestBody && req.headers['content-type'] === 'application/json') {
                let clone = null;
                if (req.body && req.headers['content-length'] > 1000) {
                    clone = JSON.parse(JSON.stringify(req.body));
                    for (const key in clone) {
                        if (clone[key] && clone[key].length > 255) {
                            clone[key] = clone[key].slice(0, 255) + '...';
                        }
                    }
                }
                logContent.body = clone || req.body;
            }
            if (!config.app?.disableLogRequestHeaders) {
                logContent.headers = req.headers;
            }
            req.log.info(logContent);
            done();
        });
    }

    /************************************
     * Add Request ID to response headers
     ***********************************/
    if (!config?.app?.disableSendRequestIdHeader) {
        fastifyInstance.addHook('onSend', (req, res, payload, done) => {
            res.header('Request-ID', req.id);
            done();
        });
    }

    /************************************
     * Register CustomErrorHandler
     * **********************************/
    if (!config?.app?.disableApiErrorHandler) {
        fastifyInstance.setErrorHandler((error, req, res) => {
            if (error instanceof ApiError) {
                res.status(error.statusCode).send({ status: 'error', message: error.message, code: error.code, data: error.data });
            } else {
                req.log.error(error);
                const err = { status: 'error', message: 'Internal Server Error' };
                if (process.env.NODE_ENV === 'development') {
                    err.env = 'development';
                    err.error = error.message;
                    err.statusCode = error.statusCode;
                    err.code = error.code;
                }
                res.status(config?.app?.internalServerErrorCode || 200).send(err);
            }
        });
        if (!config?.app?.disableLogApiError) {
            fastifyInstance.addHook('onError', (req, res, error, done) => {
                if (error instanceof ApiError) {
                    res.log.error({
                        err: {
                            type: 'ApiError',
                            Error: {
                                message: error.message,
                                code: error.code,
                                statusCode: error.statusCode,
                            }
                        }
                    });
                }
                done();
            });
        }
    }

    /************************************
     * Health Check Routes
     * **********************************/
    if (!config?.app?.disableHealthCheckRoutes) {
        let rev = 'unknown';
        if (config?.app?.enableHealthCheckShowsGitRev) {
            try {
                rev = execSync('git rev-parse HEAD').toString().trim();
            } catch (e) {
                rev = 'unknown';
            }
        }
        fastifyInstance.all((config?.app?.healthCheckRoutesPrefix ?? '') + '/ping', async function (req, res) {
            res.ok({
                ping: 'pong',
                echo: req.body?.echo || req.query?.echo || new Date().toLocaleString(),
                tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                rev,
                random: Math.random() * Math.random()
            });
        });

        fastifyInstance.all((config?.app?.healthCheckRoutesPrefix ?? '') + '/test-api-error', function (req, res) {
            const { code } = req.query || req.body;
            throw new ApiError('Test ApiError', 'ERR_CODE', code || 400, { foo: 'bar' });
        });

        fastifyInstance.all((config?.app?.healthCheckRoutesPrefix ?? '') + '/test-uncaught-error', function (req, res) {
            throw new Error('Test uncaught error');
        });
    }

    /************************************
     * Add state object to the request
     * **********************************/
    if (!config?.app?.disableAddRequestState) {
        fastifyInstance.decorateRequest('state', null);
        fastifyInstance.addHook('onRequest', function (req, res, done) {
            req.state = {};
            done();
        });
    }

    /************************************
     * Reply Helper Functions
     * **********************************/
    if (!config?.app?.disableReplyHelperFunctions) {
        fastifyInstance.decorateReply('ok', function (data, meta) {
            return this.send({
                status: 'ok',
                data,
                meta,
            });
        });
    }

    /**********************************************
     * Register routes and start listening
     * The exported module must be a function that returns a fastify plugin
     **********************************************/
    const basePath = process.cwd()
    const apiFiles = fastGlob.sync(path.join(basePath, 'app/**/*.{js,mjs,ts}'), {
        onlyFiles: true,
    });
    for (const apiFile of apiFiles) {
        const filename = apiFile.split(path.sep).pop();
        if (filename.startsWith('_')) {
            continue;
        }
        const length = path.join(basePath, 'app/').length;
        const prefix = apiFile.slice(length, -(filename.length + 1));
        fastifyInstance.register((await import(apiFile)).default(), {
            prefix,
        });
    }
    
    return fastifyInstance;
}

async function start() {
    return new Promise((resolve, reject) => {
        fastifyInstance.listen(fastifyInstance.config.server, (err, address) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('\x1b[32m%s\x1b[0m', `HTTP Server now listening on ${address}`);
                resolve(fastifyInstance);
            }
        });
    });
}

export default fastifyInstance;
export { init, start, ApiError };