'use strict';

const path = require('node:path')

module.exports = (
    /**
     * @description Initialize the fastify server
     * @param {Object} config - Configuration information
     * @param {Object} config.server - The first parameter passed to fastify.listen
     * @param {Number} [config.server.host] - Listening address
     * @param {Number} [config.server.port] - Listening port number
     * @param {Object} config.fastify - Configuration passed to fastify initialization
     * @param {Boolean} [config.fastify.disableRequestLogging] - Whether to disable request logging, default false
     * @param {Boolean|Object} [config.fastify.logger] - Logger configuration, default true
     * @param {Boolean|Array} [config.fastify.trustProxy] - trustProxy configuration, default true
     * @param {Number} [config.fastify.bodyLimit] - bodyLimit configuration, default 52428800 (50Mb)
     * @param {Object} config.app - Application configuration
     * @param {Boolean} config.app.disableCors - Whether to disable the cors plugin, default false
     * @param {Boolean} config.app.disableLogRequestBody - Whether to disable logging of request body, default false
     * @param {Boolean} config.app.disableSendRequestIdHeader - Whether to disable sending Request ID in response headers, default false
     * @param {Boolean} config.app.disableApiErrorHandler - Whether to disable the ApiErrorHandler, default false
     * @param {Boolean} config.app.disableLogApiError - Whether to disable logging of ApiError, default false
     * @param {Boolean} config.app.disableHealthCheckRoutes - Whether to disable health check routes, default false
     * @param {String} config.app.healthCheckRoutesPrefix - Prefix for health check routes, default empty
     * @param {Boolean} config.app.disableAddRequestState - Whether to disable adding request state, default false
     * @param {Boolean} config.app.disableReplyHelperFunctions - Whether to disable Reply Helper Functions, default false
     * @param {String} config.app.globalAppVariable - Global fastify variable name, an empty string means the initialized fastify will not be placed in global, default "app"
     * @param {Object} [config.database] - Database connection information, if not provided, knex will not be initialized, otherwise, initialize with the configuration information and store the instance in the global knex variable
     * @param {String} config.database.client - The database type supported by knex, e.g., mysql, pg, sqlite3, mssql
     * @param {Object} config.database[config.database.client] - knex connection configuration
     * @returns 
     */
    function(config) {
        /************************************
         * Initialize knex and put it in global
         ************************************/
        if (config.database?.client) {
            Object.defineProperty(global, 'knex', {
                value: require('knex')({
                    client: config.database.client,
                    connection: config.database[config.database.client],
                    pool: config.database.pool
                }),
            })
        }

        /************************************
         * Initialize fastify and put it in global
         ************************************/
        const app = require('fastify')(Object.assign({
            logger: true,
            trustProxy: true,
            disableRequestLogging: false,
            bodyLimit: 52428800, //in bytes, 50Mb
        }, config.fastify))
        if (config.app.globalAppVariable) {
            Object.defineProperty(global, config.app.globalAppVariable, {value: app})
        }

        /************************************
         * put config in app, freezed
         ************************************/
        Object.freeze(config)
        Object.defineProperty(app, 'config', {value: config})

        /************************************
         * Register cors plugin
         ************************************/
        if (!config.app.disableCors) {
            app.register(require('@fastify/cors'))
        }

        /************************************
         * Log request body
         ************************************/
        if (!config.app.disableLogRequestBody) {
            app.addHook('preHandler', (req, res, done) => {
                let clone = null;
                if (req.body && req.headers['content-length'] > 1000) {
                    clone = JSON.parse(JSON.stringify(req.body));
                    for (const key in clone) {
                        if (clone[key] && clone[key].length > 100) {
                            clone[key] = clone[key].slice(0, 100) + '...';
                        }
                    }
                }
                req.log.info({url: req.url, body: clone || req.body, headers: req.headers});
                done()
            })
        }

        /************************************
         * Add Request ID to response headers
         ***********************************/
        if (!config.app.disableSendRequestIdHeader) {
            app.addHook('onSend', (req, res, payload, done) => {
                res.header('Request-ID', req.id)
                done()
            })
        }

        /************************************
         * Register CustomErrorHandler
         * **********************************/
        if (!config.app.disableApiErrorHandler) {
            Object.defineProperty(global, 'ApiError', {
                value: class ApiError extends Error {
                    constructor(message, code, statusCode=200) {
                        super(message)
                        this.code = code
                        this.statusCode = statusCode
                    }
                }
            })
            app.setErrorHandler((error, req, res) => {
                if (error instanceof ApiError) {
                    res.status(error.statusCode).send({status: 'error', message: error.message, code: error.code})
                } else {
                    req.log.error(error)
                    const err = {status: 'error', message: 'Internal Server Error'}
                    if (process.env.NODE_ENV === 'development') {
                        err.env = 'development'
                        err.error = error.message
                        err.statusCode = error.statusCode
                        err.code = error.code
                    }
                    res.status(config.app.InternalServerErrorCode || 200).send(err)
                }
            })
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
                        })
                    }
                    done()
                })
            }
        }
        
        /************************************
         * Health Check Routes
         * **********************************/
        if (!config.app.disableHealthCheckRoutes) {
            let rev = 'unknown'
            if (config.app.enableHealthCheckShowsGitRev) {
                try {
                    rev = require('child_process').execSync('git rev-parse HEAD').toString().trim()
                } catch(e) {
                    rev = 'unknown'
                }
            }
            app.all((config.app.healthCheckRoutesPrefix ?? '') + '/ping', async function(req, res) {
                res.status(200).send({
                    ping: 'pong',
                    echo: req.body?.echo || req.query?.echo || new Date().toLocaleString(),
                    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    rev,
                    random: Math.random() * Math.random()
                })
            })

            app.all((config.app.healthCheckRoutesPrefix ?? '') + '/test-api-error', function (req, res) {
                const {code} = req.query || req.body
                throw new ApiError('Test ApiError', 'ERR_CODE', code || 400)
            })

            app.all((config.app.healthCheckRoutesPrefix ?? '') + '/test-uncaught-error', function (req, res) {
                throw new Error('Test uncaught error')
            })
        }

        /************************************
         * Add state object to the request
         * **********************************/
        if (!config.app.disableAddRequestState) {
            app.decorateRequest('state', null)
            app.addHook('onRequest', function(req, res, done) {
                req.state = {}
                done()
            })
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
                })
            })
        }

        /**********************************************
        * Register routes
        * The exported module must be a function that returns a fastify plugin
        **********************************************/
        const apiFiles = require('fast-glob').sync(path.join(require.main.path, 'app/**/api.js'), {
            onlyFiles: true,
        })
        for (const apiFile of apiFiles) {
            /* 去掉文件开头的 /app 和 结尾的 /api.js，剩下的就是 prefix */
            const length = path.join(require.main.path, 'app/').length
            const prefix = apiFile.slice(length, -7)
            app.register(require(`${apiFile}`)(), {
                prefix,
            })
        }

        /*******************
         * START THE SERVER
         *******************/
        app.listen(app.config.server, (err, address) => {
            if (err) {
                console.log(err)
            } else {
                console.log('\x1b[32m%s\x1b[0m', `Service now listening on ${address}`)
                console.log('Press Ctrl-C to quit.')
            }
        })
        
        return app
    } /* END OF function(config) */
);