# A simple fastify application server

## Description

This is a simple file-based routing fasitfy application skeleton for JSON API server with some pre-defined features.

After calling the default exported function, the fastify server will listen on the specified host and port. The returned value of the function is a fastify instance.

## File-based routing

Any `{.js, .mjs, .ts}` file in the `app` and it's subfolders of your project root that does not starts with underscore(`_`) will be registered as a fastify plugin. The subfolder name will be the prefix. For example, if you have an `app/user/api.js` or `app/user/other-file.mjs` file, you can access it via `http://localhost:port/user/YOUR-API`.

## Reply helpers

There are some useful helpers can be used in the route handler. In the following example, the `req` is the first parameter of the handler, also know as `request`. The `res` is the second parameter of the handler function, also known as the `reply` object in fastify.

### `res.ok(data, meta)`

Send a 200 response with the data and meta object.

Can be disabled by setting the `app.disableReplyHelperFunctions` to `true`.

`res.ok({ok: 'It works!'}, {addition: 'someValue'})`

```json
{
    "status": "ok",
    "data": {
        "ok": "It works!"
    },
    "meta": {
        "addition": "someValue"
    }
}
```

### `throw new ApiError(message, code, statusCode, data)`

Send an error object to the client with message and code. The HTTP status code will be set to statusCode(defaults to 200).

Can be disabled by setting the `app.disableApiErrorHandler` to `true`.

`throw new ApiError('User Not found', 'err_code_user_not_found', 404, {'error_field':'user'})` will return with http status code 404:

```json
{
    "status": "error",
    "message": "User Not found",
    "code": "err_code_user_not_found",
    "error_field": "user"
}
```

## Health-checking endpoints

By default, some endpoints for health checking are registered. This behavior can be disabled by setting the `app.disableHealthCheckRoutes` to `true`.

The prefix of these endpoints can be changed by setting the `app.healthCheckRoutesPrefix` in the config.

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

By default, the server will add the CORS headers to the response. This behavior can be disabled by setting the `app.disableCors` to `true`.

### Logging enabled

By default, the server will log the request and response to console. This behavior can be disabled by setting the `fastify.disableRequestLogging` to `true`, or by setting the `fastify.logger`. All the settings under the `fastify` key will be passed to the `fastify` construct function.

### Log request body and headers

By default, the server will log the request body and headers. These behaviors can be disabled by setting the `app.disableLogRequestBody` or `app.disableLogRequestHeaders` to `true`.

### Send request id header

By default, the server will send a `Request-Id` header to the client. This behavior can be disabled by setting the `app.disableSendRequestIdHeader` to `true`.

### ApiError handler and response

By default, if `ApiError(message, code, statusCode, data)` is not caught by local error handler, the server will handle this ApiError and return the error object to the client, with HTTP status code `statusCode` which defaults to `200`.

The response format is:

```json
{
    "status": "error",
    "message": "custom error messsage string or object",
    "code": "custom error code",
    "data": "additional data"
}
```

This behavior can be disabled by setting the `app.disableApiErrorHandler` to `true`.

### Other errors handler and default error response

By default, the server will handle the uncaught errors and return the error object to the client. The HTTP status code defaults to 200 which also can be changed by settting `app.InternalServerErrorCode`. If `process.env.NODE_ENV === 'development'`, the error detail will be sent to the client.

The response format is:

```json
{
    "status": "error",
    "message": "Internal Server Error"
}
```

This handler can be disabled by setting the `app.disableApiErrorHandler` to `true`.

### Log API error

By default, the server will log the API error(`throw new ApiError()`). This behavior can be disabled by setting the `app.disableLogApiError` to `true`.

## Usage

### Install

```bash
npm install fastify-app js-yaml
```

> **Note**
>
> The `js-yaml` can be omitted if you don't want to use a yaml config file.

### Create a config file

Create a `config.yaml` file in your project root with the following example:

```yaml
server:
  host: 0.0.0.0
  port: 53004

fastify:
  disableRequestLogging: false
  bodyLimit: 52428800 #in bytes, 50Mb
  logger:
    redact:
      - "req.headers.authorization"

app:
  disableCors: false
  disableLogRequestBody: false
  disableLogRequestHeaders: false
  disableLogApiError: false
  disableSendRequestIdHeader: false
  disableApiErrorHandler: false
  internalServerErrorCode: 200
  disableHealthCheckRoutes: false
  healthCheckRoutesPrefix: "/health-check"
  enableHealthCheckShowsGitRev: false
  disableAddRequestState: false
  disableReplyHelperFunctions: false
```

### Create your first API endpoint

> CommonJS and ES module are both supported.

Create an `app` folder in your project root, and create a js file in it, `api.js` for example (or `.mjs` or `.ts`), with the following content:

```javascript
'use strict';
const {ApiError} = require('fastify-app');

module.exports = function() {
    // Put custom code here, runs before fastify initializing.
    // your custom code

    // then return your plugin function to the fastify register.

    return plugin
}

function plugin(fastify, opts, done) {
    fastify.get('/ok', async function(req, res) {
        return res.ok({
            fooBar: 'It works!',
        })
    })
    fastify.get('/err', async function(req, res) {
        throw new ApiError('User Not found', 'err_code_user_not_found', 404, {'foo':'bar'})
    })
    done()
}
```

After starting the server, this API endpoint can be accssed via `http://host:port/ok`.

You can also create subfolders in the `app` folder to organize your API. If you have an `app/user/api.js` file, you can access it via `http://localhost:port/user/endpoint-in-api.js`.

Files with names starting with an underscore will not be registered to the fastify instance.

### Start the server (CommonJS)
```javascript
const {default:fastifyApp, init, start} = require('fastify-app');
const { load } = require('js-yaml');
const { readFileSync } = require('fs');
const knex = require('knex');

const config = load(readFileSync('./config.yaml', 'utf8'));

;(async() => {
    await init(config); //after calling init(), the fastifyApp is an initialized fastify instance.
    await start(); //or you can write your own listen logic.
})();
```

### Start the server (ES module)
```javascript
import FastifyApp, {init, start, ApiError} from 'fastify-app';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

const config = load(readFileSync('./config.yaml', 'utf8'));

;(async() => {
    await init(config);
    await start();
})();
```

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