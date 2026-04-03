# A simple Fastify application skeleton for JSON API server

## Description

This is a simple Fastify 5.8 file-based routing application skeleton for JSON API servers with some pre-defined features.

After calling the exported `init()` and `start()` functions, the Fastify server will listen on the specified host and port. The default export is a Fastify instance proxy that becomes usable after `init()`.

`fastify-app` itself is authored in TypeScript and published with prebuilt outputs for all supported consumption styles:

- `dist/index.cjs` for CommonJS
- `dist/index.mjs` for ESM
- `dist/index.d.ts` and `dist/index.d.mts` for TypeScript tooling

That means existing `require('fastify-app')` and `import ... from 'fastify-app'` callers can keep their current code, and TypeScript projects get types automatically.

## Installation

Just let your AI agent follow the instructions in `ai/INSTALL.md` to set up the scaffold in your project.

In detailed steps:
1. Create a project directory
2. Open that directory using your AI agent
3. Copy the raw content of `ai/INSTALL.md`
4. Paste it into the dialog and press Enter

That's it! No `npx create-xxxx` or manual file creation needed, do things the agentic way.

## Repository development

If you are working on this repository itself instead of consuming the published package:

- source entry: `src/index.ts`
- build command: `npm run build`
- build tool: `tsup`
- emitted files: `dist/index.cjs`, `dist/index.mjs`, `dist/index.d.ts`, `dist/index.d.mts`
- `npm test` runs the build first and then executes the integration suite

## File-based routing

Any `.js`, `.mjs`, or `.ts` file in `app/**` that does not start with underscore (`_`) will be registered as a Fastify plugin. The folder name becomes the route prefix. For example, `app/user/api.js` or `app/user/other-file.mjs` will be available under `http://localhost:port/user/...`.

By default, file names are **not** included in the generated prefix. If you set `app.includeFileNameInRoutePrefix` to `true`, the file name will be appended as another prefix segment, except for `index` files. For example:

- `app/user/profile.mjs` -> `/user/profile/...`
- `app/user/index.mjs` -> `/user/...`

You can also control how generated prefix segments are normalized with `app.routePrefixCase`:

- `preserve` (default): keep directory and file names as-is
- `kebab-case`: normalize every participating prefix segment to kebab-case

For example, with `app.includeFileNameInRoutePrefix = true` and `app.routePrefixCase = 'kebab-case'`, `app/adminPanel/userSettings.mjs` becomes `/admin-panel/user-settings/...`.

You can change the route discovery directory with `app.routesDirectory`. Route files may export either a default factory function or a named `plugin` export, but the recommended style is an anonymous default-exported factory that returns an anonymous plugin function.

## Middleware-style patterns

In this scaffold, prefer these two straightforward patterns:

### File-level hooks with `addHook`

Use a file-level hook when every route defined in the same route file should share the same behavior.

```javascript
export default function () {
    return async function (fastify) {
        fastify.addHook('preHandler', async function (request) {
            request.state.traceId = request.headers['x-trace-id'] ?? request.id;
        });

        fastify.get('/context', async function (request, reply) {
            return reply.ok({
                traceId: request.state.traceId,
            });
        });
    };
}
```

### Route-level `preHandler` in options

Use route options when only one route or a small subset of routes needs the guard.

```javascript
import { ApiError } from 'fastify-app';

export default function () {
    return async function (fastify) {
        fastify.get(
            '/admin',
            {
                preHandler: async function (request) {
                    if (request.headers['x-role'] !== 'admin') {
                        throw new ApiError('Admin role required', 'ERR_ROLE_REQUIRED', 403, {
                            requiredRole: 'admin',
                        });
                    }
                },
            },
            async function (request, reply) {
                return reply.ok({ ok: true });
            }
        );
    };
}
```

If multiple files need the same guard, extract a plain helper function and reuse it from each route file. Avoid building a directory-wide middleware penetration layer unless you really need a custom plugin tree.

## Reply helpers

There are some useful helpers you can use in the route handler. In the following example, `req` is the first parameter of the handler, also known as `request`, and `res` is the second parameter, also known as `reply`.

### `res.ok(data, meta)`

Send a 200 response with the data and meta object.

Can be disabled by setting `app.disableReplyHelperFunctions` to `true`.

`res.ok({baz: 'It works!'}, {foo: 'bar'})`

```json
{
    "status": "ok",
    "data": {
        "baz": "It works!"
    },
    "meta": {
        "foo": "bar"
    }
}
```

### `throw new ApiError(message, code, statusCode, data)`

Send an error object to the client with message and code. The HTTP status code will be set to statusCode(defaults to 200).

```javascript
import { ApiError } from 'fastify-app';
// and in your route handler:
// ...
throw new ApiError('User Not found', 'err_code_user_not_found', 404, {'error_field':'user'})
```
will return with http status code 404:

```json
{
    "status": "error",
    "message": "User Not found",
    "code": "err_code_user_not_found",
    "data": {
        "error_field": "username"
    }
}
```
This feature can be disabled by setting `app.disableApiErrorHandler` to `true`.

## Health-checking endpoints

By default, some endpoints for health checking are registered. This behavior can be disabled by setting `app.disableHealthCheckRoutes` to `true`.

The prefix of these endpoints can be changed by setting `app.healthCheckRoutesPrefix` in the config. Leading and trailing slashes are normalized.

If `app.enableHealthCheckShowsGitRev` is enabled, the git revision is resolved lazily on the first request and cached afterwards. You can adjust the command timeout with `app.healthCheckGitRevTimeout`.

You can also control whether the ping payload includes timezone and random noise by setting `app.healthCheckExposeTimezone` and `app.healthCheckExposeRandom`.

### `GET|POST /health-check/ping`

For health checking.

### `GET|POST /health-check/test-api-error?code=401`

Generate an api error response with the code passed in the query string.

### `GET|POST /health-check/test-uncaught-error`

Generate an uncaught error response.

## Other features

### Request state

By default, a `state` object will be registered to the request object by using `fastify.decorateRequest`. This behavior can be disabled by setting the `app.disableAddRequestState` to `true`.

### CORS

By default, the server will add the CORS headers to the response. This behavior can be disabled by setting `app.disableCors` to `true`.

If you need more control, pass `app.corsOptions`; it will be merged with the scaffold's default CORS settings.

### Logging enabled

By default, the server will log the request and response to console. This behavior can be disabled by setting `fastify.disableRequestLogging` to `true`. All settings under the `fastify` key are passed to the Fastify constructor.

### Log request body and headers

By default, the server will log the request body and headers. These behaviors can be disabled by setting `app.disableLogRequestBody` or `app.disableLogRequestHeaders` to `true`.

Large request bodies are truncated recursively before logging. You can tune this behavior with:

- `app.requestBodyLogThreshold`
- `app.requestBodyLogMaxStringLength`
- `app.requestBodyLogMaxArrayLength`
- `app.requestBodyLogMaxDepth`
- `app.requestBodyLogLevel`
- `app.requestBodyLogContentTypes`

> **Sensitive headers** 
> 
> If you want to redact sensitive headers from the logs, you can set the `fastify.logger.redact` option in the config.

### Send request id header

By default, the server will send a `Request-Id` header to the client. This behavior can be disabled by setting `app.disableSendRequestIdHeader` to `true`.

### Other errors handler and default error response

By default, the server will handle uncaught errors and return a generic error object to the client. The HTTP status code defaults to `200`, and can be changed with `app.internalServerErrorCode`. If `process.env.NODE_ENV === 'development'`, the error detail will be sent to the client.

The response format is:

```json
{
    "status": "error",
    "message": "Internal Server Error"
}
```

This handler can be disabled by setting `app.disableApiErrorHandler` to `true`.

### Log API error

By default, the server will log the API error (`throw new ApiError()`). This behavior can be disabled by setting `app.disableLogApiError` to `true`.

If needed, you can change the log severity for ApiError entries with `app.apiErrorLogLevel`.

## Usage

### Install

```bash
npm install fastify-app
```

The published package already includes its compiled `dist/` outputs and type declarations, so consumers do not need to transpile `node_modules/fastify-app`.

### Create a config file

Create a config file in your project root with an extension that matches your runtime, such as `config.cjs`, `config.mjs`, or compiled TypeScript output. The example below uses ESM syntax:

```javascript
export default {
    server: {
        host: '0.0.0.0',
        port: 63004,
    },
    fastify: {
        disableRequestLogging: false,
        bodyLimit: 52428800, // 50Mb
        logger: {
            redact: ['req.headers.authorization'],
        },
    },
    app: {
        disableCors: false,
        corsOptions: {
            exposedHeaders: ['request-id'],
        },
        disableLogRequestBody: false,
        disableLogRequestHeaders: false,
        disableLogApiError: false,
        apiErrorLogLevel: 'error',
        disableSendRequestIdHeader: false,
        disableApiErrorHandler: false,
        internalServerErrorCode: 200,
        disableHealthCheckRoutes: false,
        healthCheckRoutesPrefix: '/health-check',
        enableHealthCheckShowsGitRev: false,
        healthCheckGitRevTimeout: 1000,
        disableAddRequestState: false,
        disableReplyHelperFunctions: false,
        healthCheckExposeTimezone: true,
        healthCheckExposeRandom: true,
        includeFileNameInRoutePrefix: false,
        routePrefixCase: 'preserve',
        requestBodyLogThreshold: 1000,
        requestBodyLogMaxStringLength: 255,
        requestBodyLogMaxArrayLength: 20,
        requestBodyLogMaxDepth: 5,
        requestBodyLogLevel: 'info',
        requestBodyLogContentTypes: ['application/json'],
        routesDirectory: 'app',
    },
};
```

### Create your first API endpoint

> CommonJS, ES module, and TypeScript are all supported.

Create an `app` folder in your project root, and create a JS file in it, `api.js` for example (or `.mjs` or `.ts`), with the following content:

```javascript
'use strict';

const { ApiError } = require('fastify-app');

module.exports = function () {
    return async function (fastify) {
        fastify.get('/ok', async function (req, res) {
            return res.ok({
                fooBar: 'It works!',
            });
        });

        fastify.get('/err', async function () {
            throw new ApiError('User Not found', 'err_code_user_not_found', 404, { foo: 'bar' });
        });
    };
};
```

Use the `fastify` argument passed into the returned plugin. Do not use the package default export inside route files.

After starting the server, this API endpoint can be accessed via `http://host:port/ok`.

You can also create subfolders in the `app` folder to organize your API. If you have an `app/user/api.js` file, routes inside it are served under `http://localhost:port/user/...`.

If you prefer file names to be part of the generated prefix, set `app.includeFileNameInRoutePrefix` to `true`. When combined with `app.routePrefixCase = 'kebab-case'`, both directory and file-name segments are normalized before being registered.

Files with names starting with an underscore will not be registered to the fastify instance.

### Start the server (CommonJS)
```javascript
const { init, start } = require('fastify-app');

const config = require('./config.js');

;(async () => {
    await init(config);
    await start();
})();
```

### Start the server (ES module)
```javascript
import { init, start } from 'fastify-app';
import config from './config.js';

;(async () => {
    await init(config);
    await start();
})();
```

### Start the server (TypeScript)
```typescript
import { init, start, type FastifyConfig } from 'fastify-app';

const config = {
    server: {
        host: '0.0.0.0',
        port: 63004,
    },
} satisfies FastifyConfig;

;(async () => {
    await init(config);
    await start();
})();
```

If you keep your app config in its own TypeScript module, you can also export it with `satisfies FastifyConfig` for editor hints and safer refactors.

## Breaking changes

### 2.0.0
- Now the `fastify-app` default export is a variable that contains the fastify instance (which is undefined before calling `init()`).
- The initialized fastify instance is no longer defined as a global property (There is no `global.app`).
- The `config` object is now passed to the `init` function.
- The `init` and `start` functions and `ApiError` class are now exported from the `fastify-app` module.
- The `config` object is no longer defined as a property of the fastify app instance (There is no `global.app.config`).

### 1.1.0
- The database is no longer initialized. You need to initialize the database connection yourself.
- Route files are no longer limited to `api.js`. Any file that does not start with an underscore and ends with `{.js, .mjs, .ts}` will be registered to the fastify instance.