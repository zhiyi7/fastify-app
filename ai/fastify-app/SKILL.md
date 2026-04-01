---
name: fastify-app
description: Apply this skill when you are adding or modifying routes, working with hooks, middlewares, or doing other Fastify-related jobs.
---
<fastify-app>

Apply this skill when you are adding or modifying routes, working with hooks, middlewares, or doing other Fastify-related jobs.

## fastify-app skeleton

This project uses `fastify-app` package, which initializes Fastify 5 based on configuration and automatically loads plugins under the route directory (often `app/`), along with some common initialization and feature additions.

## `FastifyApp` default export

The package default export is a proxy to the singleton Fastify instance created by `init(config)`.

## Route directory to URL mapping

Route discovery is controlled by `app.routesDirectory` in config.

- default route directory: `app`
- files whose basename starts with `_` are ignored by auto-discovery
- by default, folder names determine the generated prefix
- file names only join the prefix when `app.includeFileNameInRoutePrefix = true`
- when `app.routePrefixCase = 'kebab-case'`, participating folder and file segments are normalized

Examples:

- `app/index.mjs` → `/`
- `app/user/index.mjs` → `/user`
- `app/user/profile.mjs` → `/user` when `includeFileNameInRoutePrefix = false` else `/user/profile`
- `app/adminPanel/userSettings.mjs` → `/admin-panel/user-settings` when `routePrefixCase` is `kebab-case`

**Use `kebab-case` for route directories and filenames unless otherwise specified.**

## Responses and request state

### `reply.ok`

When `app.disableReplyHelperFunctions` is not enabled, `reply.ok(data, meta)` is available.

- response shape: `{ status: 'ok', data, meta }`
- `meta` is optional


### `ApiError`

Use `ApiError` for controlled API failures:

```javascript
// Don't forget import { ApiError } from 'fastify-app';
throw new ApiError('User not found', 'ERR_USER_NOT_FOUND', 404, {
    userId: '123',
});
```

**Always use `return reply.ok()` and `throw new ApiError()` to keep the API consistent unless explicitly requested otherwise.**

### `request.state`

When `app.disableAddRequestState` is not enabled, every request gets a fresh `request.state = {}`. It's a `fastify.decorateRequest` property and initialized for each request.

## Middleware patterns and hook usage

### 1: plugin-level `addHook`

Use plugin-level hooks when the same behavior should apply to every route defined in the same route plugin.

Example:

```javascript
export default function () {
    return async function (fastify) {
        fastify.addHook('preHandler', async function (request) {
            //code...
        });

        fastify.get('/context', /* rest code */);
    };
}
```

### 2: route-level options with `preHandler`

Example:

```javascript
import { ApiError } from 'fastify-app';

export default function () {
    return async function (fastify) {
        fastify.get(
            '/admin',
            { preHandler: ['checkAdmin', 'setRequestId'] },
            async function (request, reply) {
                // Code
            }
        );
    };
}
```

**Middleware in this project means hooks and route options, not Express middleware**

## Things to remember

- auto-loaded route files should default-export a factory that returns the actual Fastify plugin function
- prefer anonymous factory functions and anonymous plugin functions in route files
- prefer async-style route plugins over callback-style ones
- folder nesting affects prefixes, not automatic middleware inheritance
- use the `fastify` plugin argument inside route files, not `FastifyApp` unless necessary.
</fastify-app>