'use strict';

import path from 'node:path';
import fastify from 'fastify';
import fastGlob from 'fast-glob';
import cors from '@fastify/cors';
import { execSync } from 'node:child_process';

export default function (config) {
    /************************************
     * Initialize fastify and put it in global
     ************************************/
    const app = fastify(Object.assign({
        logger: true,
        trustProxy: true,
        disableRequestLogging: false,
        bodyLimit: 52428800, //in bytes, 50Mb
    }, config.fastify));
    if (config.app.globalAppVariable) {
        Object.defineProperty(global, config.app.globalAppVariable, { value: app });
    }

    /************************************
     * put config in app, freezed
     ************************************/
    Object.freeze(config);
    Object.defineProperty(app, 'config', { value: config });

    /************************************
     * Register cors plugin
     ************************************/
    if (!config.app.disableCors) {
        app.register(cors);
    }

    /************************************
     * Log request body and headers
     ************************************/
    if (!config.app.disableLogRequestBody || !config.app.disableLogRequestHeaders) {
        app.addHook('preHandler', (req, res, done) => {
            const logContent = { url: req.url };
            if (!config.app.disableLogRequestBody && req.headers['content-type'] === 'application/json') {
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
            if (!config.app.disableLogRequestHeaders) {
                logContent.headers = req.headers;
            }
            req.log.info(logContent);
            done();
        });
    }

    /************************************
     * Add Request ID to response headers
     ***********************************/
    if (!config.app.disableSendRequestIdHeader) {
        app.addHook('onSend', (req, res, payload, done) => {
            res.header('Request-ID', req.id);
            done();
        });
    }

    /************************************
     * Register CustomErrorHandler
     * **********************************/
    if (!config.app.disableApiErrorHandler) {
        class ApiError extends Error {
            constructor(message, code, statusCode = 200) {
                super(message);
                this.code = code;
                this.statusCode = statusCode;
            }
        }
        Object.defineProperty(global, 'ApiError', { value: ApiError });
        app.setErrorHandler((error, req, res) => {
            if (error instanceof ApiError) {
                res.status(error.statusCode).send({ status: 'error', message: error.message, code: error.code });
            } else {
                req.log.error(error);
                const err = { status: 'error', message: 'Internal Server Error' };
                if (process.env.NODE_ENV === 'development') {
                    err.env = 'development';
                    err.error = error.message;
                    err.statusCode = error.statusCode;
                    err.code = error.code;
                }
                res.status(config.app.internalServerErrorCode || 200).send(err);
            }
        });
        if (!config.app.disableLogApiError) {
            app.addHook('onError', (req, res, error, done) => {
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
    if (!config.app.disableHealthCheckRoutes) {
        let rev = 'unknown';
        if (config.app.enableHealthCheckShowsGitRev) {
            try {
                rev = execSync('git rev-parse HEAD').toString().trim();
            } catch (e) {
                rev = 'unknown';
            }
        }
        app.all((config.app.healthCheckRoutesPrefix ?? '') + '/ping', async function (req, res) {
            res.status(200).send({
                ping: 'pong',
                echo: req.body?.echo || req.query?.echo || new Date().toLocaleString(),
                tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                rev,
                random: Math.random() * Math.random()
            });
        });

        app.all((config.app.healthCheckRoutesPrefix ?? '') + '/test-api-error', function (req, res) {
            const { code } = req.query || req.body;
            throw new ApiError('Test ApiError', 'ERR_CODE', code || 400);
        });

        app.all((config.app.healthCheckRoutesPrefix ?? '') + '/test-uncaught-error', function (req, res) {
            throw new Error('Test uncaught error');
        });
    }

    /************************************
     * Add state object to the request
     * **********************************/
    if (!config.app.disableAddRequestState) {
        app.decorateRequest('state', null);
        app.addHook('onRequest', function (req, res, done) {
            req.state = {};
            done();
        });
    }

    /************************************
     * Reply Helper Functions
     * **********************************/
    if (!config.app.disableReplyHelperFunctions) {
        app.decorateReply('ok', function (data, meta) {
            return this.send({
                status: 'ok',
                data,
                meta,
            });
        });
    }

    /**********************************************
     * Register routes
     * The exported module must be a function that returns a fastify plugin
     **********************************************/
    (async () => {
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
            app.register((await import(apiFile)).default(), {
                prefix,
            });
        }
        /*******************
         * START THE SERVER
         *******************/
        app.listen(app.config.server, (err, address) => {
            if (err) {
                console.log(err);
            } else {
                console.log('\x1b[32m%s\x1b[0m', `Service now listening on ${address}`);
                console.log('Press Ctrl-C to quit.');
            }
        });
    })();

    return app;
}
