'use strict';

import path from 'node:path';
import fastify from 'fastify';
import fastGlob from 'fast-glob';
import cors from '@fastify/cors';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

const execFileAsync = promisify(execFile);
const defaultRequestBodyLogThreshold = 1000;
const defaultRequestBodyLogMaxStringLength = 255;
const defaultRequestBodyLogMaxArrayLength = 20;
const defaultRequestBodyLogMaxDepth = 5;
const defaultRequestBodyLogContentTypes = ['application/json'];
const defaultCorsOptions = {
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: '*',
    credentials: true,
    maxAge: 86400,
};

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
 * @property {Object} [app.corsOptions] - Additional options passed to the CORS plugin and merged with the defaults
 * @property {boolean} [app.disableLogRequestBody] - Whether to disable logging request body
 * @property {boolean} [app.disableLogRequestHeaders] - Whether to disable logging request headers
 * @property {boolean} [app.disableSendRequestIdHeader] - Whether to disable sending request ID in response headers
 * @property {boolean} [app.disableApiErrorHandler] - Whether to disable API error handler
 * @property {boolean} [app.disableLogApiError] - Whether to disable logging API errors
 * @property {string} [app.apiErrorLogLevel] - Log level used when logging ApiError instances
 * @property {boolean} [app.disableHealthCheckRoutes] - Whether to disable health check routes
 * @property {string} [app.healthCheckRoutesPrefix] - Prefix for health check routes
 * @property {boolean} [app.enableHealthCheckShowsGitRev] - Whether to show git revision in health check response
 * @property {number} [app.healthCheckGitRevTimeout] - Timeout in milliseconds for reading git revision
 * @property {boolean} [app.healthCheckExposeTimezone] - Whether to include timezone in health check payload
 * @property {boolean} [app.healthCheckExposeRandom] - Whether to include random in health check payload
 * @property {boolean} [app.disableAddRequestState] - Whether to disable adding state object to request
 * @property {boolean} [app.disableReplyHelperFunctions] - Whether to disable reply helper functions
 * @property {number} [app.internalServerErrorCode] - Status code for internal server errors
 * @property {string} [app.routesDirectory] - Directory containing route files, relative to process cwd unless absolute
 * @property {boolean} [app.includeFileNameInRoutePrefix] - Whether route file names should participate in the generated route prefix
 * @property {'preserve'|'kebab-case'} [app.routePrefixCase] - Whether generated route prefix segments should keep their original form or be normalized to kebab-case
 * @property {number} [app.requestBodyLogThreshold] - Content length threshold before request body truncation kicks in
 * @property {number} [app.requestBodyLogMaxStringLength] - Maximum string length stored in request body logs
 * @property {number} [app.requestBodyLogMaxArrayLength] - Maximum number of array items stored in request body logs
 * @property {number} [app.requestBodyLogMaxDepth] - Maximum nested depth stored in request body logs
 * @property {string} [app.requestBodyLogLevel] - Log level used for request body log entries
 * @property {string[]} [app.requestBodyLogContentTypes] - Content type prefixes that should have their bodies logged
 * @property {Object} [server] - Server configuration for listening
 */

let fastifyInstance;
let configCopy;

function normalizeRoutePrefix(prefix = '') {
    if (!prefix) {
        return '';
    }

    const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '');

    return normalizedPrefix ? `/${normalizedPrefix}` : '';
}

function toKebabCaseSegment(segment) {
    return segment
        .replace(/([A-Z]+)([A-Z][a-z0-9])/g, '$1-$2')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

function normalizeRouteSegment(segment, routePrefixCase) {
    if (!segment) {
        return '';
    }

    if (routePrefixCase === 'kebab-case') {
        return toKebabCaseSegment(segment);
    }

    return segment;
}

function buildRoutePrefix(apiFile, appDirectory, appConfig) {
    const relativeFilePath = path.relative(appDirectory, apiFile);
    const relativeDirectory = path.dirname(relativeFilePath);
    const routeSegments = relativeDirectory === '.'
        ? []
        : relativeDirectory.split(path.sep).filter(Boolean);

    if (appConfig.includeFileNameInRoutePrefix) {
        const fileName = path.parse(relativeFilePath).name;

        if (fileName && fileName !== 'index') {
            routeSegments.push(fileName);
        }
    }

    const prefixSegments = routeSegments
        .map((segment) => normalizeRouteSegment(segment, appConfig.routePrefixCase))
        .filter(Boolean);

    return normalizeRoutePrefix(prefixSegments.join('/'));
}

function shouldTruncateRequestBody(req, threshold) {
    const contentLength = Number.parseInt(req.headers['content-length'] ?? '', 10);

    return Boolean(req.body) && Number.isFinite(contentLength) && contentLength > threshold;
}

function truncateString(value, maxLength) {
    if (typeof value !== 'string' || value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength)}...`;
}

function sanitizeLoggedBody(value, options, depth = 0, seen = new WeakSet()) {
    if (typeof value === 'string') {
        return truncateString(value, options.maxStringLength);
    }

    if (value === null || typeof value !== 'object') {
        return value;
    }

    if (seen.has(value)) {
        return '[Circular]';
    }

    if (depth >= options.maxDepth) {
        return Array.isArray(value) ? '[Array]' : '[Object]';
    }

    seen.add(value);

    if (Array.isArray(value)) {
        const result = value
            .slice(0, options.maxArrayLength)
            .map((item) => sanitizeLoggedBody(item, options, depth + 1, seen));

        if (value.length > options.maxArrayLength) {
            result.push(`...(${value.length - options.maxArrayLength} more items)`);
        }

        seen.delete(value);

        return result;
    }

    const result = Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
            key,
            sanitizeLoggedBody(item, options, depth + 1, seen),
        ])
    );

    seen.delete(value);

    return result;
}

function logWithLevel(logger, level, payload) {
    const resolvedLevel = typeof level === 'string' && typeof logger[level] === 'function'
        ? level
        : 'info';

    logger[resolvedLevel](payload);
}

function shouldLogRequestBody(contentType, allowedContentTypes) {
    return allowedContentTypes.some((allowedType) => contentType.startsWith(allowedType));
}

function buildHealthCheckPayload(req, rev, appConfig) {
    const payload = {
        ping: 'pong',
        echo: req.body?.echo || req.query?.echo || new Date().toLocaleString(),
        rev,
    };

    if (appConfig.healthCheckExposeTimezone !== false) {
        payload.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    if (appConfig.healthCheckExposeRandom !== false) {
        payload.random = Math.random() * Math.random();
    }

    return payload;
}

function createGitRevisionResolver(basePath, appConfig) {
    if (!appConfig.enableHealthCheckShowsGitRev) {
        return async function resolveGitRevision() {
            return 'unknown';
        };
    }

    let revisionPromise;

    return async function resolveGitRevision() {
        if (!revisionPromise) {
            revisionPromise = execFileAsync('git', ['rev-parse', 'HEAD'], {
                cwd: basePath,
                encoding: 'utf8',
                timeout: appConfig.healthCheckGitRevTimeout ?? 1000,
            })
                .then(({ stdout }) => stdout.trim() || 'unknown')
                .catch(() => 'unknown');
        }

        return revisionPromise;
    };
}

function resolveRouteDirectory(basePath, appConfig) {
    return path.resolve(basePath, appConfig.routesDirectory ?? 'app');
}

async function discoverRouteFiles(appDirectory) {
    const apiFiles = await fastGlob('**/*.{js,mjs,ts}', {
        cwd: appDirectory,
        onlyFiles: true,
        absolute: true,
    });

    return apiFiles
        .filter((apiFile) => !path.basename(apiFile).startsWith('_'))
        .sort((left, right) => left.localeCompare(right));
}

function resolveRoutePlugin(importedModule, apiFile) {
    if (typeof importedModule.default === 'function') {
        return importedModule.default();
    }

    if (typeof importedModule.plugin === 'function') {
        return importedModule.plugin;
    }

    throw new TypeError(`Route file ${apiFile} must export a default factory function or a named plugin function.`);
}

/**
 * Initialize a new Fastify instance with configured plugins and hooks.
 * @param {FastifyConfig} config - Configuration object for the application
 * @returns {Object} Fastify instance with added methods
 */
async function init(config) {
    configCopy = {...(config ?? {})};
    const appConfig = configCopy.app ?? {};
    const fastifyConfig = configCopy.fastify ?? {};
    const requestBodyLogOptions = {
        threshold: appConfig.requestBodyLogThreshold ?? defaultRequestBodyLogThreshold,
        maxStringLength: appConfig.requestBodyLogMaxStringLength ?? defaultRequestBodyLogMaxStringLength,
        maxArrayLength: appConfig.requestBodyLogMaxArrayLength ?? defaultRequestBodyLogMaxArrayLength,
        maxDepth: appConfig.requestBodyLogMaxDepth ?? defaultRequestBodyLogMaxDepth,
        level: appConfig.requestBodyLogLevel ?? 'info',
        contentTypes: appConfig.requestBodyLogContentTypes ?? defaultRequestBodyLogContentTypes,
    };
    const basePath = process.cwd();
    const { logger: rawLoggerConfig = {}, ...restFastifyConfig } = fastifyConfig;
    const { serializers: customSerializers = {}, ...loggerConfig } = rawLoggerConfig;
    /************************************
     * Initialize fastify and put it in global
     ************************************/
    fastifyInstance = fastify(Object.assign({
        logger: {
            serializers: {
                res(res) {
                    return {
                        statusCode: res.statusCode,
                        contentLength: res.getHeader('content-length'),
                    };
                },
                req(req) {
                    return {
                        remoteAddress: req.ip,
                        method: req.method,
                        host: req.hostname,
                        url: req.url,
                        parameters: req.parameters,
                        headers: appConfig.disableLogRequestHeaders ? null : req.headers,
                    };
                },
                ...customSerializers,
            },
            ...loggerConfig,
        },
        trustProxy: true,
        disableRequestLogging: false,
        bodyLimit: 52428800, //in bytes, 50Mb
    }, restFastifyConfig));

    /************************************
     * Register cors plugin
     ************************************/
    if (!appConfig.disableCors) {
        fastifyInstance.register(cors, {
            ...defaultCorsOptions,
            ...(appConfig.corsOptions ?? {}),
        });
    }

    /************************************
     * Log request body and headers
     ************************************/
    if (!appConfig.disableLogRequestBody) {
        fastifyInstance.addHook('preHandler', (req, res, done) => {
            const logContent = { url: req.url };
            const contentType = req.headers['content-type'] ?? '';
            if (shouldLogRequestBody(contentType, requestBodyLogOptions.contentTypes)) {
                logContent.body = shouldTruncateRequestBody(req, requestBodyLogOptions.threshold)
                    ? sanitizeLoggedBody(req.body, requestBodyLogOptions)
                    : req.body;
            }
            logWithLevel(req.log, requestBodyLogOptions.level, logContent);
            done();
        });
    }

    /************************************
     * Add Request ID to response headers
     ***********************************/
    if (!appConfig.disableSendRequestIdHeader) {
        fastifyInstance.addHook('onSend', (req, res, payload, done) => {
            res.header('Request-Id', req.id);
            done();
        });
    }

    /************************************
     * Register CustomErrorHandler
     * **********************************/
    if (!appConfig.disableApiErrorHandler) {
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
                res.status(appConfig.internalServerErrorCode || 200).send(err);
            }
        });
        if (!appConfig.disableLogApiError) {
            fastifyInstance.addHook('onError', (req, res, error, done) => {
                if (error instanceof ApiError) {
                    logWithLevel(res.log, appConfig.apiErrorLogLevel ?? 'error', {
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
    if (!appConfig.disableHealthCheckRoutes) {
        const getGitRevision = createGitRevisionResolver(basePath, appConfig);
        const healthCheckRoutesPrefix = normalizeRoutePrefix(appConfig.healthCheckRoutesPrefix ?? '');
        fastifyInstance.all(`${healthCheckRoutesPrefix}/ping`, async function (req, res) {
            const rev = await getGitRevision();
            res.ok(buildHealthCheckPayload(req, rev, appConfig));
        });

        fastifyInstance.all(`${healthCheckRoutesPrefix}/test-api-error`, function (req, res) {
            const { code } = req.query || req.body;
            throw new ApiError('Test ApiError', 'ERR_CODE', code || 400, { foo: 'bar' });
        });

        fastifyInstance.all(`${healthCheckRoutesPrefix}/test-uncaught-error`, function (req, res) {
            throw new Error('Test uncaught error');
        });
    }

    /************************************
     * Add state object to the request
     * **********************************/
    if (!appConfig.disableAddRequestState) {
        fastifyInstance.decorateRequest('state', null);
        fastifyInstance.addHook('onRequest', function (req, res, done) {
            req.state = {};
            done();
        });
    }

    /************************************
     * Reply Helper Functions
     * **********************************/
    if (!appConfig.disableReplyHelperFunctions) {
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
    const appDirectory = resolveRouteDirectory(basePath, appConfig);
    const apiFiles = await discoverRouteFiles(appDirectory);
    const routeEntries = apiFiles.map((apiFile) => {
        return {
            apiFile,
            prefix: buildRoutePrefix(apiFile, appDirectory, appConfig),
        };
    });
    const importedModules = await Promise.all(
        routeEntries.map(({ apiFile }) => import(pathToFileURL(apiFile).href))
    );

    routeEntries.forEach(({ apiFile, prefix }, index) => {
        fastifyInstance.register(resolveRoutePlugin(importedModules[index], apiFile), {
            prefix,
        });
    });
    
    return fastifyInstance;
}

async function start() {
    try {
        const address = await fastifyInstance.listen(configCopy.server);
        console.log('\x1b[32m%s\x1b[0m', `HTTP Server now listening on ${address}`);
        return fastifyInstance;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const instanceProxy = new Proxy({}, {
    get(target, prop) {
      if (!fastifyInstance) return undefined;
      return fastifyInstance[prop];
    },
    apply(target, thisArg, args) {
      if (!fastifyInstance) return undefined;
      return Reflect.apply(fastifyInstance, thisArg, args);
    }
});

export default instanceProxy;
export { init, start, ApiError };