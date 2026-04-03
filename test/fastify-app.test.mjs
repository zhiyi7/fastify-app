'use strict';

import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { init, start } from 'fastify-app';

const fixtureRoot = fileURLToPath(new URL('../fixtures/scaffold/', import.meta.url));
const previousNodeEnv = process.env.NODE_ENV;

process.env.NODE_ENV = 'test';

after(() => {
    process.env.NODE_ENV = previousNodeEnv;
});

function parseJsonLines(lines) {
    return lines
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                return null;
            }
        })
        .filter(Boolean);
}

function clearLogs(logs) {
    logs.splice(0, logs.length);
}

async function requestJson(port, pathname, options = {}) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`, options);
    const text = await response.text();

    let body = null;
    if (text) {
        try {
            body = JSON.parse(text);
        } catch (error) {
            body = text;
        }
    }

    return {
        response,
        body,
        text,
    };
}

async function withServer(config, callback) {
    const previousCwd = process.cwd();
    const logs = [];
    const logStream = {
        write(chunk) {
            logs.push(String(chunk));
        },
    };

    process.chdir(fixtureRoot);

    try {
        const instance = await init({
            server: {
                host: '127.0.0.1',
                port: 0,
            },
            fastify: {
                ...(config.fastify ?? {}),
                logger: {
                    level: 'info',
                    ...(config.fastify?.logger ?? {}),
                    stream: logStream,
                },
            },
            app: config.app ?? {},
        });

        await start();

        const address = instance.server.address();
        assert.ok(address && typeof address === 'object', 'server must listen on a TCP port');

        try {
            return await callback({
                instance,
                port: address.port,
                logs,
            });
        } finally {
            await instance.close();
        }
    } finally {
        process.chdir(previousCwd);
    }
}

test('默认脚手架功能和路由都能工作', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                enableHealthCheckShowsGitRev: true,
                healthCheckRoutesPrefix: '/health-check/',
            },
        },
        async ({ port, logs }) => {
            clearLogs(logs);

            const replyOk = await requestJson(port, '/reply-ok', {
                headers: {
                    origin: 'https://example.com',
                },
            });

            assert.equal(replyOk.response.status, 200);
            assert.equal(replyOk.response.headers.get('access-control-allow-origin'), 'https://example.com');
            assert.ok(replyOk.response.headers.get('request-id'));
            assert.deepEqual(replyOk.body, {
                status: 'ok',
                data: {
                    message: 'hello',
                },
                meta: {
                    source: 'helper',
                },
            });

            const featureFlags = await requestJson(port, '/feature-flags');
            assert.deepEqual(featureFlags.body, {
                hasOk: true,
                hasState: true,
                state: {},
            });

            const stateMutate = await requestJson(port, '/state-mutate');
            assert.deepEqual(stateMutate.body, {
                hasState: true,
                state: {
                    fromRoute: 'route-updated',
                },
            });

            const jsRoute = await requestJson(port, '/js-route');
            assert.deepEqual(jsRoute.body, {
                format: 'cjs',
                ok: true,
            });

            const nestedRoute = await requestJson(port, '/nested/route');
            assert.deepEqual(nestedRoute.body, {
                nested: true,
            });

            const ignoredRoute = await fetch(`http://127.0.0.1:${port}/ignored`);
            assert.equal(ignoredRoute.status, 404);

            const healthCheck = await requestJson(port, '/health-check/ping?echo=hello');
            assert.equal(healthCheck.response.status, 200);
            assert.equal(healthCheck.body.status, 'ok');
            assert.deepEqual(healthCheck.body.data.ping, 'pong');
            assert.equal(healthCheck.body.data.echo, 'hello');
            assert.match(healthCheck.body.data.rev, /^[0-9a-f]{40}$/);

            const apiError = await requestJson(port, '/health-check/test-api-error?code=401');
            assert.equal(apiError.response.status, 401);
            assert.deepEqual(apiError.body, {
                status: 'error',
                message: 'Test ApiError',
                code: 'ERR_CODE',
                data: {
                    foo: 'bar',
                },
            });

            const uncaughtError = await requestJson(port, '/health-check/test-uncaught-error');
            assert.equal(uncaughtError.response.status, 200);
            assert.deepEqual(uncaughtError.body, {
                status: 'error',
                message: 'Internal Server Error',
            });

            clearLogs(logs);
            const longText = 'x'.repeat(1100);
            await requestJson(port, '/echo', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'x-trace-id': 'abc123',
                    origin: 'https://example.com',
                },
                body: JSON.stringify({
                    text: longText,
                    nested: {
                        innerText: longText,
                    },
                    items: [
                        longText,
                        'short',
                    ],
                }),
            });

            const logEntries = parseJsonLines(logs);
            const requestLog = logEntries.find((entry) => entry.req?.url === '/echo');
            assert.ok(requestLog, '应该记录请求日志');
            assert.equal(requestLog.req.headers['x-trace-id'], 'abc123');

            const bodyLog = logEntries.find((entry) => entry.url === '/echo');
            assert.ok(bodyLog, '应该记录请求体日志');
            assert.equal(bodyLog.body.text.length, 258);
            assert.equal(bodyLog.body.text.endsWith('...'), true);
            assert.equal(bodyLog.body.nested.innerText.length, 258);
            assert.equal(bodyLog.body.nested.innerText.endsWith('...'), true);
            assert.equal(bodyLog.body.items[0].length, 258);
            assert.equal(bodyLog.body.items[0].endsWith('...'), true);
            assert.equal(bodyLog.body.items[1], 'short');
        }
    );
});

test('关闭开关后，各分支会按预期退化', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                disableCors: true,
                disableLogRequestBody: true,
                disableLogRequestHeaders: true,
                disableSendRequestIdHeader: true,
                disableLogApiError: true,
                disableHealthCheckRoutes: true,
                disableAddRequestState: true,
                disableReplyHelperFunctions: true,
            },
        },
        async ({ port, logs }) => {
            clearLogs(logs);

            const replyOk = await requestJson(port, '/reply-ok', {
                headers: {
                    origin: 'https://example.com',
                },
            });

            assert.equal(replyOk.response.headers.get('access-control-allow-origin'), null);
            assert.equal(replyOk.response.headers.get('request-id'), null);
            assert.deepEqual(replyOk.body, {
                status: 'missing-helper',
                hasOk: false,
            });

            const featureFlags = await requestJson(port, '/feature-flags');
            assert.deepEqual(featureFlags.body, {
                hasOk: false,
                hasState: false,
                state: null,
            });

            const stateMutate = await requestJson(port, '/state-mutate');
            assert.deepEqual(stateMutate.body, {
                hasState: false,
                state: null,
            });

            const healthCheck = await fetch(`http://127.0.0.1:${port}/health-check/ping`);
            assert.equal(healthCheck.status, 404);

            clearLogs(logs);
            await requestJson(port, '/echo', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'x-trace-id': 'abc123',
                },
                body: JSON.stringify({
                    text: 'x'.repeat(1100),
                }),
            });

            const logEntries = parseJsonLines(logs);
            const requestLog = logEntries.find((entry) => entry.req?.url === '/echo');
            assert.ok(requestLog, '应该仍然记录基础请求日志');
            assert.equal(requestLog.req.headers, null);
            assert.equal(logEntries.some((entry) => entry.url === '/echo'), false);

            clearLogs(logs);
            const apiError = await requestJson(port, '/api-error');
            assert.equal(apiError.response.status, 409);
            assert.equal(apiError.body.status, 'error');
            assert.equal(apiError.body.message, 'Test ApiError');
            assert.equal(apiError.body.code, 'ERR_CODE');
            assert.deepEqual(apiError.body.data, {
                foo: 'bar',
            });

            const apiErrorLogs = parseJsonLines(logs);
            assert.equal(apiErrorLogs.some((entry) => JSON.stringify(entry).includes('ERR_CODE')), false);

            const uncaughtError = await requestJson(port, '/uncaught-error');
            assert.equal(uncaughtError.response.status, 200);
            assert.deepEqual(uncaughtError.body, {
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    );
});

test('关闭 ApiError 处理器后，Fastify 默认错误响应会接管', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                disableApiErrorHandler: true,
            },
        },
        async ({ port }) => {
            const apiError = await requestJson(port, '/api-error');
            assert.equal(apiError.response.status, 409);
            assert.equal(apiError.body.message, 'Test ApiError');
            assert.equal(apiError.body.error, 'Conflict');
            assert.equal(apiError.body.statusCode, 409);

            const uncaughtError = await requestJson(port, '/uncaught-error');
            assert.equal(uncaughtError.response.status, 500);
            assert.equal(uncaughtError.body.message, 'Test uncaught error');
            assert.equal(uncaughtError.body.error, 'Internal Server Error');
        }
    );
});

test('支持自定义路由目录和命名导出插件', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                disableHealthCheckRoutes: true,
                routesDirectory: 'custom-routes',
            },
        },
        async ({ port }) => {
            const customRoute = await requestJson(port, '/custom-route');
            assert.equal(customRoute.response.status, 200);
            assert.deepEqual(customRoute.body, {
                from: 'custom-routes',
                ok: true,
            });

            const namedPluginRoute = await requestJson(port, '/v1/named-plugin');
            assert.equal(namedPluginRoute.response.status, 200);
            assert.deepEqual(namedPluginRoute.body, {
                exportType: 'named-plugin',
                ok: true,
            });

            const ignoredRoute = await fetch(`http://127.0.0.1:${port}/should-not-load`);
            assert.equal(ignoredRoute.status, 404);
        }
    );
});

test('支持自定义 CORS、health-check 和 logging 配置', { concurrency: false }, async () => {
    await withServer(
        {
            fastify: {
                logger: {
                    level: 'debug',
                },
            },
            app: {
                corsOptions: {
                    origin: 'https://custom.example',
                    exposedHeaders: ['request-id'],
                    maxAge: 120,
                },
                requestBodyLogThreshold: 10,
                requestBodyLogMaxStringLength: 5,
                requestBodyLogLevel: 'debug',
                healthCheckExposeTimezone: false,
                healthCheckExposeRandom: false,
            },
        },
        async ({ port, logs }) => {
            clearLogs(logs);

            const replyOk = await requestJson(port, '/reply-ok', {
                headers: {
                    origin: 'https://irrelevant.example',
                },
            });

            assert.equal(replyOk.response.headers.get('access-control-allow-origin'), 'https://custom.example');
            assert.equal(replyOk.response.headers.get('access-control-expose-headers'), 'request-id');

            const healthCheck = await requestJson(port, '/ping?echo=configured');
            assert.equal(healthCheck.response.status, 200);
            assert.equal(healthCheck.body.data.echo, 'configured');
            assert.equal(Object.prototype.hasOwnProperty.call(healthCheck.body.data, 'tz'), false);
            assert.equal(Object.prototype.hasOwnProperty.call(healthCheck.body.data, 'random'), false);

            clearLogs(logs);
            await requestJson(port, '/echo', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    text: 'hello world',
                }),
            });

            const logEntries = parseJsonLines(logs);
            const bodyLog = logEntries.find((entry) => entry.url === '/echo');
            assert.ok(bodyLog, '应该记录自定义级别下的请求体日志');
            assert.equal(bodyLog.body.text, 'hello...');
        }
    );
});

test('支持把文件名加入路由前缀，并保持原始大小写', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                disableHealthCheckRoutes: true,
                includeFileNameInRoutePrefix: true,
            },
        },
        async ({ port }) => {
            const userProfile = await requestJson(port, '/userProfile/details');
            assert.equal(userProfile.response.status, 200);
            assert.deepEqual(userProfile.body, {
                source: 'userProfile',
            });

            const adminPanel = await requestJson(port, '/adminPanel/userSettings/info');
            assert.equal(adminPanel.response.status, 200);
            assert.deepEqual(adminPanel.body, {
                source: 'adminPanel/userSettings',
            });

            const nestedIndex = await requestJson(port, '/nested/route');
            assert.equal(nestedIndex.response.status, 200);
            assert.deepEqual(nestedIndex.body, {
                nested: true,
            });

            const indexPrefixed = await fetch(`http://127.0.0.1:${port}/nested/index/route`);
            assert.equal(indexPrefixed.status, 404);
        }
    );
});

test('支持把目录和文件名前缀统一转成 kebab-case', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                disableHealthCheckRoutes: true,
                includeFileNameInRoutePrefix: true,
                routePrefixCase: 'kebab-case',
            },
        },
        async ({ port }) => {
            const userProfile = await requestJson(port, '/user-profile/details');
            assert.equal(userProfile.response.status, 200);
            assert.deepEqual(userProfile.body, {
                source: 'userProfile',
            });

            const adminPanel = await requestJson(port, '/admin-panel/user-settings/info');
            assert.equal(adminPanel.response.status, 200);
            assert.deepEqual(adminPanel.body, {
                source: 'adminPanel/userSettings',
            });

            const originalCase = await fetch(`http://127.0.0.1:${port}/adminPanel/userSettings/info`);
            assert.equal(originalCase.status, 404);
        }
    );
});

test('支持在单个 route file 里用 addHook 复用行为', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                disableHealthCheckRoutes: true,
            },
        },
        async ({ port }) => {
            const context = await requestJson(port, '/file-hook/context', {
                headers: {
                    'x-trace-id': 'trace-from-file',
                },
            });
            assert.equal(context.response.status, 200);
            assert.deepEqual(context.body, {
                status: 'ok',
                data: {
                    traceId: 'trace-from-file',
                    guardSource: 'file-hook',
                    route: 'context',
                },
            });

            const details = await requestJson(port, '/file-hook/details', {
                headers: {
                    'x-trace-id': 'trace-from-details',
                },
            });
            assert.equal(details.response.status, 200);
            assert.deepEqual(details.body, {
                status: 'ok',
                data: {
                    traceId: 'trace-from-details',
                    guardSource: 'file-hook',
                    route: 'details',
                },
            });
        }
    );
});

test('支持在路由 options 里直接传 preHandler', { concurrency: false }, async () => {
    await withServer(
        {
            app: {
                disableHealthCheckRoutes: true,
            },
        },
        async ({ port }) => {
            const publicRoute = await requestJson(port, '/route-options/public');
            assert.equal(publicRoute.response.status, 200);
            assert.deepEqual(publicRoute.body, {
                status: 'ok',
                data: {
                    route: 'public',
                    role: null,
                },
            });

            const adminDenied = await requestJson(port, '/route-options/admin');
            assert.equal(adminDenied.response.status, 403);
            assert.deepEqual(adminDenied.body, {
                status: 'error',
                message: 'Admin role required',
                code: 'ERR_ROLE_REQUIRED',
                data: {
                    requiredRole: 'admin',
                },
            });

            const adminRoute = await requestJson(port, '/route-options/admin', {
                headers: {
                    'x-role': 'admin',
                },
            });
            assert.equal(adminRoute.response.status, 200);
            assert.deepEqual(adminRoute.body, {
                status: 'ok',
                data: {
                    route: 'admin',
                    role: 'admin',
                },
            });

            const traceOnly = await requestJson(port, '/route-options/trace-only', {
                headers: {
                    'x-trace-id': 'trace-from-route-options',
                },
            });
            assert.equal(traceOnly.response.status, 200);
            assert.deepEqual(traceOnly.body, {
                status: 'ok',
                data: {
                    route: 'trace-only',
                    traceId: 'trace-from-route-options',
                },
            });
        }
    );
});
