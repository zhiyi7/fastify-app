# fastify-app based project initialization guide

`fastify-app` is a Fastify 5 file-based routing scaffold for JSON APIs.

You use this guide to initialize a new project scaffold based on `fastify-app`.

## What to do

1. Run `npm install fastify-app`.
2. Create the project structure shown below.
3. Fill in the files with the provided template code.
4. Copy `node_modules/fastify-app/ai/fastify-app/SKILL.md` into the project's skill location.

You are creating a real, runnable application scaffold, so the file and its contents can be adjusted as needed, but make sure to keep the structure complete and retain the comments.

If any file exists, you just choose a new file name and keep going.

## Project structure to create

```text
/
├── server.mjs
├── config.mjs
├── app/
│   ├── index.mjs
│   └── example-api/
│       ├── index.mjs
│       └── example-api.mjs
├── services/
├── actions/
└── .agents/
    └── skills/
        └── fastify-app/
            └── SKILL.md
```

## Files to generate

### `server.mjs`

Create the startup entry file:

```javascript
import { init, start } from 'fastify-app';
import config from './config.mjs';

;(async () => {
    await init(config);
    await start();
})();
```

### `config.mjs`

Create the full config file:

```javascript
export default {
    server: {
        host: '0.0.0.0', // Listen address. Common values: '0.0.0.0' for external access, '127.0.0.1' for local only.
        port: 63004, // Listen port. Change this to any available port.
    },
    fastify: {
        disableRequestLogging: false, // Disable Fastify request/response logging.
        bodyLimit: 52428800, // Request body size limit in bytes. Default: 50MB.
        logger: {
            level: 'info', // Log level. Allowed: fatal, error, warn, info, debug, trace, silent.
            redact: ['req.headers.authorization'], // Log paths to redact.
        },
    },
    app: {
        disableCors: false, // Disable CORS.
        corsOptions: {
            exposedHeaders: ['request-id'], // Extra response headers exposed to browsers.
        },
        disableLogRequestBody: false, // Disable request body logging.
        disableLogRequestHeaders: false, // Disable request header logging.
        disableSendRequestIdHeader: false, // Disable the Request-Id response header.
        disableApiErrorHandler: false, // Disable the built-in ApiError and uncaught error handler.
        disableLogApiError: false, // Disable ApiError logging.
        apiErrorLogLevel: 'error', // Log level for ApiError entries.
        disableHealthCheckRoutes: false, // Disable health check routes.
        healthCheckRoutesPrefix: '/health-check', // Prefix for health check routes.
        enableHealthCheckShowsGitRev: false, // Include git revision in health check responses.
        healthCheckGitRevTimeout: 1000, // Git revision lookup timeout in milliseconds.
        healthCheckExposeTimezone: true, // Include timezone in health check responses.
        healthCheckExposeRandom: true, // Include random value in health check responses.
        disableAddRequestState: false, // Disable request.state.
        disableReplyHelperFunctions: false, // Disable reply.ok.
        internalServerErrorCode: 200, // Status code for uncaught errors.
        includeFileNameInRoutePrefix: false, // Include the file name in the generated route prefix.
        routePrefixCase: 'preserve', // Route prefix casing strategy. Allowed: 'preserve', 'kebab-case'.
        requestBodyLogThreshold: 1000, // Truncate request bodies larger than this threshold.
        requestBodyLogMaxStringLength: 255, // Max string length kept in request body logs.
        requestBodyLogMaxArrayLength: 20, // Max array length kept in request body logs.
        requestBodyLogMaxDepth: 5, // Max nesting depth kept in request body logs.
        requestBodyLogLevel: 'info', // Log level for request body logs.
        requestBodyLogContentTypes: ['application/json'], // Content-type prefixes that should have their bodies logged.
        routesDirectory: 'app', // Route directory relative to the project root, or an absolute path.
    },
};
```

### `app/index.mjs`

Create the root route file:

```javascript
export default function () {
    return async function (fastify) {
        fastify.get('/', async function (request, reply) {
            return reply.ok({
                message: 'fastify-app is ready',
            });
        });
    };
}
```

### `app/example-api/index.mjs`

Create the example route group entry file:

```javascript
export default function () {
    return async function (fastify) {
        fastify.get('/meta', async function () {
            return {
                api: 'example-api',
                type: 'folder-plugin',
            };
        });
    };
}
```

### `app/example-api/example-api.mjs`

Create the example route file:

```javascript
import { ApiError } from 'fastify-app';

export default function () {
    return async function (fastify) {
        fastify.get('/hello', async function (request, reply) {
            return reply.ok({
                foo: 'hello from example-api',
            });
        });

        fastify.post('/echo', async function (request, reply) {
            return reply.ok({
                echo: request.body ?? null,
            });
        });

        fastify.get('/error', async function () {
            throw new ApiError('This is a test error from example-api.', 'ERR_EXAMPLE_API', 500, {
                source: 'example-api',
            });
        });
    };
}
```

### `services/` and `actions/`

Create both directories if they do not already exist.

### `.agents/skills/fastify-app/SKILL.md`

Copy the skill file from `node_modules/fastify-app/ai/fastify-app/SKILL.md` into this location.

The location can be `.agents/`, `.claude/`, `.github/`, or any other folder you use for custom skills.

## Output constraints

- Keep the initialization output complete and deterministic.
- Include the full scaffold structure shown above.
- Include the full config example shown above.
- Keep every config option comment inline after the option.
- Do not omit any config field from the template.