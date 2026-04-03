// src/index.ts
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { pathToFileURL } from "url";
import cors from "@fastify/cors";
import fastGlob from "fast-glob";
import fastify from "fastify";
var execFileAsync = promisify(execFile);
var defaultRequestBodyLogThreshold = 1e3;
var defaultRequestBodyLogMaxStringLength = 255;
var defaultRequestBodyLogMaxArrayLength = 20;
var defaultRequestBodyLogMaxDepth = 5;
var defaultRequestBodyLogContentTypes = ["application/json"];
var defaultCorsOptions = {
  origin: true,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: "*",
  credentials: true,
  maxAge: 86400
};
var ApiError = class extends Error {
  code;
  statusCode;
  data;
  constructor(message, code, statusCode = 200, data = {}) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;
    this.name = "ApiError";
  }
};
var fastifyInstance;
var configCopy = {};
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function getRecordValue(source, key) {
  if (!isRecord(source)) {
    return void 0;
  }
  return source[key];
}
function getRequestValue(req, key) {
  return getRecordValue(req.query, key) ?? getRecordValue(req.body, key);
}
function getLegacyRequestParameters(req) {
  return req.parameters;
}
function normalizeRoutePrefix(prefix = "") {
  if (!prefix) {
    return "";
  }
  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, "");
  return normalizedPrefix ? `/${normalizedPrefix}` : "";
}
function toKebabCaseSegment(segment) {
  return segment.replace(/([A-Z]+)([A-Z][a-z0-9])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}
function normalizeRouteSegment(segment, routePrefixCase = "preserve") {
  if (!segment) {
    return "";
  }
  if (routePrefixCase === "kebab-case") {
    return toKebabCaseSegment(segment);
  }
  return segment;
}
function buildRoutePrefix(apiFile, appDirectory, appConfig) {
  const relativeFilePath = path.relative(appDirectory, apiFile);
  const relativeDirectory = path.dirname(relativeFilePath);
  const routeSegments = relativeDirectory === "." ? [] : relativeDirectory.split(path.sep).filter(Boolean);
  if (appConfig.includeFileNameInRoutePrefix) {
    const fileName = path.parse(relativeFilePath).name;
    if (fileName && fileName !== "index") {
      routeSegments.push(fileName);
    }
  }
  const prefixSegments = routeSegments.map((segment) => normalizeRouteSegment(segment, appConfig.routePrefixCase)).filter(Boolean);
  return normalizeRoutePrefix(prefixSegments.join("/"));
}
function shouldTruncateRequestBody(req, threshold) {
  const contentLength = Number.parseInt(String(req.headers["content-length"] ?? ""), 10);
  return Boolean(req.body) && Number.isFinite(contentLength) && contentLength > threshold;
}
function truncateString(value, maxLength) {
  if (typeof value !== "string" || value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}...`;
}
function sanitizeLoggedBody(value, options, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
  if (typeof value === "string") {
    return truncateString(value, options.maxStringLength);
  }
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return "[Circular]";
  }
  if (depth >= options.maxDepth) {
    return Array.isArray(value) ? "[Array]" : "[Object]";
  }
  seen.add(value);
  if (Array.isArray(value)) {
    const result2 = value.slice(0, options.maxArrayLength).map((item) => sanitizeLoggedBody(item, options, depth + 1, seen));
    if (value.length > options.maxArrayLength) {
      result2.push(`...(${value.length - options.maxArrayLength} more items)`);
    }
    seen.delete(value);
    return result2;
  }
  const result = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      sanitizeLoggedBody(item, options, depth + 1, seen)
    ])
  );
  seen.delete(value);
  return result;
}
function logWithLevel(logger, level, payload) {
  const typedLogger = logger;
  const resolvedLoggerMethod = typeof level === "string" ? typedLogger[level] : void 0;
  if (typeof resolvedLoggerMethod === "function") {
    resolvedLoggerMethod.call(typedLogger, payload);
    return;
  }
  logger.info(payload);
}
function shouldLogRequestBody(contentType, allowedContentTypes) {
  return allowedContentTypes.some((allowedType) => contentType.startsWith(allowedType));
}
function buildHealthCheckPayload(req, rev, appConfig) {
  const payload = {
    ping: "pong",
    echo: getRecordValue(req.body, "echo") ?? getRecordValue(req.query, "echo") ?? (/* @__PURE__ */ new Date()).toLocaleString(),
    rev
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
      return "unknown";
    };
  }
  let revisionPromise;
  return async function resolveGitRevision() {
    if (!revisionPromise) {
      revisionPromise = execFileAsync("git", ["rev-parse", "HEAD"], {
        cwd: basePath,
        encoding: "utf8",
        timeout: appConfig.healthCheckGitRevTimeout ?? 1e3
      }).then(({ stdout }) => stdout.trim() || "unknown").catch(() => "unknown");
    }
    return revisionPromise;
  };
}
function resolveRouteDirectory(basePath, appConfig) {
  return path.resolve(basePath, appConfig.routesDirectory ?? "app");
}
async function discoverRouteFiles(appDirectory) {
  const apiFiles = await fastGlob("**/*.{js,mjs,ts}", {
    cwd: appDirectory,
    onlyFiles: true,
    absolute: true
  });
  return apiFiles.filter((apiFile) => !path.basename(apiFile).startsWith("_")).sort((left, right) => left.localeCompare(right));
}
function resolveRoutePlugin(importedModule, apiFile) {
  if (typeof importedModule.default === "function") {
    return importedModule.default();
  }
  if (typeof importedModule.plugin === "function") {
    return importedModule.plugin;
  }
  throw new TypeError(`Route file ${apiFile} must export a default factory function or a named plugin function.`);
}
async function init(config) {
  configCopy = { ...config ?? {} };
  const appConfig = configCopy.app ?? {};
  const fastifyConfig = configCopy.fastify ?? {};
  const requestBodyLogOptions = {
    threshold: appConfig.requestBodyLogThreshold ?? defaultRequestBodyLogThreshold,
    maxStringLength: appConfig.requestBodyLogMaxStringLength ?? defaultRequestBodyLogMaxStringLength,
    maxArrayLength: appConfig.requestBodyLogMaxArrayLength ?? defaultRequestBodyLogMaxArrayLength,
    maxDepth: appConfig.requestBodyLogMaxDepth ?? defaultRequestBodyLogMaxDepth,
    level: appConfig.requestBodyLogLevel ?? "info",
    contentTypes: appConfig.requestBodyLogContentTypes ?? defaultRequestBodyLogContentTypes
  };
  const basePath = process.cwd();
  const { logger: rawLoggerConfig, ...restFastifyConfig } = fastifyConfig;
  const normalizedLoggerConfig = isRecord(rawLoggerConfig) ? rawLoggerConfig : {};
  const { serializers, ...loggerConfig } = normalizedLoggerConfig;
  const customSerializers = isRecord(serializers) ? serializers : {};
  const app = fastify({
    logger: {
      serializers: {
        res(reply) {
          return {
            statusCode: reply.statusCode,
            contentLength: typeof reply.getHeader === "function" ? reply.getHeader("content-length") : void 0
          };
        },
        req(req) {
          return {
            remoteAddress: req.ip,
            method: req.method,
            host: req.hostname,
            url: req.url,
            parameters: getLegacyRequestParameters(req),
            headers: appConfig.disableLogRequestHeaders ? null : req.headers
          };
        },
        ...customSerializers
      },
      ...loggerConfig
    },
    trustProxy: true,
    disableRequestLogging: false,
    bodyLimit: 52428800,
    ...restFastifyConfig
  });
  fastifyInstance = app;
  if (!appConfig.disableCors) {
    app.register(cors, {
      ...defaultCorsOptions,
      ...appConfig.corsOptions ?? {}
    });
  }
  if (!appConfig.disableLogRequestBody) {
    app.addHook("preHandler", (req, _reply, done) => {
      const logContent = { url: req.url };
      const contentType = String(req.headers["content-type"] ?? "");
      if (shouldLogRequestBody(contentType, requestBodyLogOptions.contentTypes)) {
        logContent.body = shouldTruncateRequestBody(req, requestBodyLogOptions.threshold) ? sanitizeLoggedBody(req.body, requestBodyLogOptions) : req.body;
      }
      logWithLevel(req.log, requestBodyLogOptions.level, logContent);
      done();
    });
  }
  if (!appConfig.disableSendRequestIdHeader) {
    app.addHook("onSend", (req, reply, payload, done) => {
      reply.header("Request-Id", req.id);
      done(null, payload);
    });
  }
  if (!appConfig.disableApiErrorHandler) {
    app.setErrorHandler((error, req, reply) => {
      if (error instanceof ApiError) {
        reply.status(error.statusCode).send({
          status: "error",
          message: error.message,
          code: error.code,
          data: error.data
        });
        return;
      }
      const normalizedError = error;
      req.log.error(error);
      const err = {
        status: "error",
        message: "Internal Server Error"
      };
      if (process.env.NODE_ENV === "development") {
        err.env = "development";
        err.error = normalizedError.message;
        err.statusCode = normalizedError.statusCode;
        err.code = normalizedError.code;
      }
      reply.status(appConfig.internalServerErrorCode ?? 200).send(err);
    });
    if (!appConfig.disableLogApiError) {
      app.addHook("onError", (req, reply, error, done) => {
        if (error instanceof ApiError) {
          logWithLevel(reply.log, appConfig.apiErrorLogLevel ?? "error", {
            err: {
              type: "ApiError",
              Error: {
                message: error.message,
                code: error.code,
                statusCode: error.statusCode
              }
            }
          });
        }
        done();
      });
    }
  }
  if (!appConfig.disableHealthCheckRoutes) {
    const getGitRevision = createGitRevisionResolver(basePath, appConfig);
    const healthCheckRoutesPrefix = normalizeRoutePrefix(appConfig.healthCheckRoutesPrefix ?? "");
    app.all(`${healthCheckRoutesPrefix}/ping`, async function(req, reply) {
      const rev = await getGitRevision();
      return reply.ok(buildHealthCheckPayload(req, rev, appConfig));
    });
    app.all(`${healthCheckRoutesPrefix}/test-api-error`, function(req) {
      const code = getRequestValue(req, "code");
      const parsedStatusCode = typeof code === "number" ? code : Number.parseInt(String(code ?? ""), 10);
      throw new ApiError(
        "Test ApiError",
        "ERR_CODE",
        Number.isFinite(parsedStatusCode) ? parsedStatusCode : 400,
        { foo: "bar" }
      );
    });
    app.all(`${healthCheckRoutesPrefix}/test-uncaught-error`, function() {
      throw new Error("Test uncaught error");
    });
  }
  if (!appConfig.disableAddRequestState) {
    app.decorateRequest("state", null);
    app.addHook("onRequest", function(req, _reply, done) {
      req.state = {};
      done();
    });
  }
  if (!appConfig.disableReplyHelperFunctions) {
    app.decorateReply("ok", function(data, meta) {
      return this.send({
        status: "ok",
        data,
        meta
      });
    });
  }
  const appDirectory = resolveRouteDirectory(basePath, appConfig);
  const apiFiles = await discoverRouteFiles(appDirectory);
  const routeEntries = apiFiles.map((apiFile) => ({
    apiFile,
    prefix: buildRoutePrefix(apiFile, appDirectory, appConfig)
  }));
  const importedModules = await Promise.all(
    routeEntries.map(({ apiFile }) => import(pathToFileURL(apiFile).href))
  );
  routeEntries.forEach(({ apiFile, prefix }, index) => {
    app.register(resolveRoutePlugin(importedModules[index], apiFile), {
      prefix
    });
  });
  return app;
}
async function start() {
  const app = fastifyInstance;
  if (!app) {
    throw new Error("Fastify app has not been initialized. Call init() before start().");
  }
  try {
    const address = await app.listen(configCopy.server);
    console.log("\x1B[32m%s\x1B[0m", `HTTP Server now listening on ${address}`);
    return app;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
var instanceProxy = new Proxy({}, {
  get(_target, prop) {
    if (!fastifyInstance) {
      return void 0;
    }
    return fastifyInstance[prop];
  }
});
var index_default = instanceProxy;
export {
  ApiError,
  index_default as default,
  init,
  start
};
