'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ApiError = void 0;
exports.init = init;
exports.start = start;
var _nodePath = _interopRequireDefault(require("node:path"));
var _fastify = _interopRequireDefault(require("fastify"));
var _fastGlob = _interopRequireDefault(require("fast-glob"));
var _cors = _interopRequireDefault(require("@fastify/cors"));
var _nodeChild_process = require("node:child_process");
var _nodeUtil = require("node:util");
var _nodeUrl = require("node:url");
var _excluded = ["logger"],
  _excluded2 = ["serializers"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var execFileAsync = (0, _nodeUtil.promisify)(_nodeChild_process.execFile);
var defaultRequestBodyLogThreshold = 1000;
var defaultRequestBodyLogMaxStringLength = 255;
var defaultRequestBodyLogMaxArrayLength = 20;
var defaultRequestBodyLogMaxDepth = 5;
var defaultRequestBodyLogContentTypes = ['application/json'];
var defaultCorsOptions = {
  origin: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: '*',
  credentials: true,
  maxAge: 86400
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
var ApiError = exports.ApiError = /*#__PURE__*/function (_Error) {
  function ApiError(message, code) {
    var _this;
    var statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    _classCallCheck(this, ApiError);
    _this = _callSuper(this, ApiError, [message]);
    _this.code = code;
    _this.statusCode = statusCode;
    _this.data = data;
    _this.name = 'ApiError';
    return _this;
  }
  _inherits(ApiError, _Error);
  return _createClass(ApiError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
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
var fastifyInstance;
var configCopy;
function normalizeRoutePrefix() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (!prefix) {
    return '';
  }
  var normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '');
  return normalizedPrefix ? "/".concat(normalizedPrefix) : '';
}
function toKebabCaseSegment(segment) {
  return segment.replace(/([A-Z]+)([A-Z][a-z0-9])/g, '$1-$2').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
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
  var relativeFilePath = _nodePath["default"].relative(appDirectory, apiFile);
  var relativeDirectory = _nodePath["default"].dirname(relativeFilePath);
  var routeSegments = relativeDirectory === '.' ? [] : relativeDirectory.split(_nodePath["default"].sep).filter(Boolean);
  if (appConfig.includeFileNameInRoutePrefix) {
    var fileName = _nodePath["default"].parse(relativeFilePath).name;
    if (fileName && fileName !== 'index') {
      routeSegments.push(fileName);
    }
  }
  var prefixSegments = routeSegments.map(function (segment) {
    return normalizeRouteSegment(segment, appConfig.routePrefixCase);
  }).filter(Boolean);
  return normalizeRoutePrefix(prefixSegments.join('/'));
}
function shouldTruncateRequestBody(req, threshold) {
  var _req$headers$content;
  var contentLength = Number.parseInt((_req$headers$content = req.headers['content-length']) !== null && _req$headers$content !== void 0 ? _req$headers$content : '', 10);
  return Boolean(req.body) && Number.isFinite(contentLength) && contentLength > threshold;
}
function truncateString(value, maxLength) {
  if (typeof value !== 'string' || value.length <= maxLength) {
    return value;
  }
  return "".concat(value.slice(0, maxLength), "...");
}
function sanitizeLoggedBody(value, options) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var seen = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new WeakSet();
  if (typeof value === 'string') {
    return truncateString(value, options.maxStringLength);
  }
  if (value === null || _typeof(value) !== 'object') {
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
    var _result = value.slice(0, options.maxArrayLength).map(function (item) {
      return sanitizeLoggedBody(item, options, depth + 1, seen);
    });
    if (value.length > options.maxArrayLength) {
      _result.push("...(".concat(value.length - options.maxArrayLength, " more items)"));
    }
    seen["delete"](value);
    return _result;
  }
  var result = Object.fromEntries(Object.entries(value).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      item = _ref2[1];
    return [key, sanitizeLoggedBody(item, options, depth + 1, seen)];
  }));
  seen["delete"](value);
  return result;
}
function logWithLevel(logger, level, payload) {
  var resolvedLevel = typeof level === 'string' && typeof logger[level] === 'function' ? level : 'info';
  logger[resolvedLevel](payload);
}
function shouldLogRequestBody(contentType, allowedContentTypes) {
  return allowedContentTypes.some(function (allowedType) {
    return contentType.startsWith(allowedType);
  });
}
function buildHealthCheckPayload(req, rev, appConfig) {
  var _req$body, _req$query;
  var payload = {
    ping: 'pong',
    echo: ((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.echo) || ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.echo) || new Date().toLocaleString(),
    rev: rev
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
    return /*#__PURE__*/function () {
      var _resolveGitRevision = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              return _context.a(2, 'unknown');
          }
        }, _callee);
      }));
      function resolveGitRevision() {
        return _resolveGitRevision.apply(this, arguments);
      }
      return resolveGitRevision;
    }();
  }
  var revisionPromise;
  return /*#__PURE__*/function () {
    var _resolveGitRevision2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var _appConfig$healthChec;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (!revisionPromise) {
              revisionPromise = execFileAsync('git', ['rev-parse', 'HEAD'], {
                cwd: basePath,
                encoding: 'utf8',
                timeout: (_appConfig$healthChec = appConfig.healthCheckGitRevTimeout) !== null && _appConfig$healthChec !== void 0 ? _appConfig$healthChec : 1000
              }).then(function (_ref3) {
                var stdout = _ref3.stdout;
                return stdout.trim() || 'unknown';
              })["catch"](function () {
                return 'unknown';
              });
            }
            return _context2.a(2, revisionPromise);
        }
      }, _callee2);
    }));
    function resolveGitRevision() {
      return _resolveGitRevision2.apply(this, arguments);
    }
    return resolveGitRevision;
  }();
}
function resolveRouteDirectory(basePath, appConfig) {
  var _appConfig$routesDire;
  return _nodePath["default"].resolve(basePath, (_appConfig$routesDire = appConfig.routesDirectory) !== null && _appConfig$routesDire !== void 0 ? _appConfig$routesDire : 'app');
}
function discoverRouteFiles(_x) {
  return _discoverRouteFiles.apply(this, arguments);
}
function _discoverRouteFiles() {
  _discoverRouteFiles = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(appDirectory) {
    var apiFiles;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return (0, _fastGlob["default"])('**/*.{js,mjs,ts}', {
            cwd: appDirectory,
            onlyFiles: true,
            absolute: true
          });
        case 1:
          apiFiles = _context3.v;
          return _context3.a(2, apiFiles.filter(function (apiFile) {
            return !_nodePath["default"].basename(apiFile).startsWith('_');
          }).sort(function (left, right) {
            return left.localeCompare(right);
          }));
      }
    }, _callee3);
  }));
  return _discoverRouteFiles.apply(this, arguments);
}
function resolveRoutePlugin(importedModule, apiFile) {
  if (typeof importedModule["default"] === 'function') {
    return importedModule["default"]();
  }
  if (typeof importedModule.plugin === 'function') {
    return importedModule.plugin;
  }
  throw new TypeError("Route file ".concat(apiFile, " must export a default factory function or a named plugin function."));
}

/**
 * Initialize a new Fastify instance with configured plugins and hooks.
 * @param {FastifyConfig} config - Configuration object for the application
 * @returns {Object} Fastify instance with added methods
 */
function init(_x2) {
  return _init.apply(this, arguments);
}
function _init() {
  _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(config) {
    var _configCopy$app, _configCopy$fastify, _appConfig$requestBod, _appConfig$requestBod2, _appConfig$requestBod3, _appConfig$requestBod4, _appConfig$requestBod5, _appConfig$requestBod6;
    var appConfig, fastifyConfig, requestBodyLogOptions, basePath, _fastifyConfig$logger, rawLoggerConfig, restFastifyConfig, _rawLoggerConfig$seri, customSerializers, loggerConfig, _appConfig$corsOption, _appConfig$healthChec2, getGitRevision, healthCheckRoutesPrefix, appDirectory, apiFiles, routeEntries, importedModules;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          configCopy = _objectSpread({}, config !== null && config !== void 0 ? config : {});
          appConfig = (_configCopy$app = configCopy.app) !== null && _configCopy$app !== void 0 ? _configCopy$app : {};
          fastifyConfig = (_configCopy$fastify = configCopy.fastify) !== null && _configCopy$fastify !== void 0 ? _configCopy$fastify : {};
          requestBodyLogOptions = {
            threshold: (_appConfig$requestBod = appConfig.requestBodyLogThreshold) !== null && _appConfig$requestBod !== void 0 ? _appConfig$requestBod : defaultRequestBodyLogThreshold,
            maxStringLength: (_appConfig$requestBod2 = appConfig.requestBodyLogMaxStringLength) !== null && _appConfig$requestBod2 !== void 0 ? _appConfig$requestBod2 : defaultRequestBodyLogMaxStringLength,
            maxArrayLength: (_appConfig$requestBod3 = appConfig.requestBodyLogMaxArrayLength) !== null && _appConfig$requestBod3 !== void 0 ? _appConfig$requestBod3 : defaultRequestBodyLogMaxArrayLength,
            maxDepth: (_appConfig$requestBod4 = appConfig.requestBodyLogMaxDepth) !== null && _appConfig$requestBod4 !== void 0 ? _appConfig$requestBod4 : defaultRequestBodyLogMaxDepth,
            level: (_appConfig$requestBod5 = appConfig.requestBodyLogLevel) !== null && _appConfig$requestBod5 !== void 0 ? _appConfig$requestBod5 : 'info',
            contentTypes: (_appConfig$requestBod6 = appConfig.requestBodyLogContentTypes) !== null && _appConfig$requestBod6 !== void 0 ? _appConfig$requestBod6 : defaultRequestBodyLogContentTypes
          };
          basePath = process.cwd();
          _fastifyConfig$logger = fastifyConfig.logger, rawLoggerConfig = _fastifyConfig$logger === void 0 ? {} : _fastifyConfig$logger, restFastifyConfig = _objectWithoutProperties(fastifyConfig, _excluded);
          _rawLoggerConfig$seri = rawLoggerConfig.serializers, customSerializers = _rawLoggerConfig$seri === void 0 ? {} : _rawLoggerConfig$seri, loggerConfig = _objectWithoutProperties(rawLoggerConfig, _excluded2);
          /************************************
           * Initialize fastify and put it in global
           ************************************/
          fastifyInstance = (0, _fastify["default"])(Object.assign({
            logger: _objectSpread({
              serializers: _objectSpread({
                res: function res(_res) {
                  return {
                    statusCode: _res.statusCode,
                    contentLength: _res.getHeader('content-length')
                  };
                },
                req: function req(_req) {
                  return {
                    remoteAddress: _req.ip,
                    method: _req.method,
                    host: _req.hostname,
                    url: _req.url,
                    parameters: _req.parameters,
                    headers: appConfig.disableLogRequestHeaders ? null : _req.headers
                  };
                }
              }, customSerializers)
            }, loggerConfig),
            trustProxy: true,
            disableRequestLogging: false,
            bodyLimit: 52428800 //in bytes, 50Mb
          }, restFastifyConfig));

          /************************************
           * Register cors plugin
           ************************************/
          if (!appConfig.disableCors) {
            fastifyInstance.register(_cors["default"], _objectSpread(_objectSpread({}, defaultCorsOptions), (_appConfig$corsOption = appConfig.corsOptions) !== null && _appConfig$corsOption !== void 0 ? _appConfig$corsOption : {}));
          }

          /************************************
           * Log request body and headers
           ************************************/
          if (!appConfig.disableLogRequestBody) {
            fastifyInstance.addHook('preHandler', function (req, res, done) {
              var _req$headers$content2;
              var logContent = {
                url: req.url
              };
              var contentType = (_req$headers$content2 = req.headers['content-type']) !== null && _req$headers$content2 !== void 0 ? _req$headers$content2 : '';
              if (shouldLogRequestBody(contentType, requestBodyLogOptions.contentTypes)) {
                logContent.body = shouldTruncateRequestBody(req, requestBodyLogOptions.threshold) ? sanitizeLoggedBody(req.body, requestBodyLogOptions) : req.body;
              }
              logWithLevel(req.log, requestBodyLogOptions.level, logContent);
              done();
            });
          }

          /************************************
           * Add Request ID to response headers
           ***********************************/
          if (!appConfig.disableSendRequestIdHeader) {
            fastifyInstance.addHook('onSend', function (req, res, payload, done) {
              res.header('Request-Id', req.id);
              done();
            });
          }

          /************************************
           * Register CustomErrorHandler
           * **********************************/
          if (!appConfig.disableApiErrorHandler) {
            fastifyInstance.setErrorHandler(function (error, req, res) {
              if (error instanceof ApiError) {
                res.status(error.statusCode).send({
                  status: 'error',
                  message: error.message,
                  code: error.code,
                  data: error.data
                });
              } else {
                req.log.error(error);
                var err = {
                  status: 'error',
                  message: 'Internal Server Error'
                };
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
              fastifyInstance.addHook('onError', function (req, res, error, done) {
                if (error instanceof ApiError) {
                  var _appConfig$apiErrorLo;
                  logWithLevel(res.log, (_appConfig$apiErrorLo = appConfig.apiErrorLogLevel) !== null && _appConfig$apiErrorLo !== void 0 ? _appConfig$apiErrorLo : 'error', {
                    err: {
                      type: 'ApiError',
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

          /************************************
           * Health Check Routes
           * **********************************/
          if (!appConfig.disableHealthCheckRoutes) {
            getGitRevision = createGitRevisionResolver(basePath, appConfig);
            healthCheckRoutesPrefix = normalizeRoutePrefix((_appConfig$healthChec2 = appConfig.healthCheckRoutesPrefix) !== null && _appConfig$healthChec2 !== void 0 ? _appConfig$healthChec2 : '');
            fastifyInstance.all("".concat(healthCheckRoutesPrefix, "/ping"), /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
                var rev;
                return _regenerator().w(function (_context4) {
                  while (1) switch (_context4.n) {
                    case 0:
                      _context4.n = 1;
                      return getGitRevision();
                    case 1:
                      rev = _context4.v;
                      res.ok(buildHealthCheckPayload(req, rev, appConfig));
                    case 2:
                      return _context4.a(2);
                  }
                }, _callee4);
              }));
              return function (_x3, _x4) {
                return _ref4.apply(this, arguments);
              };
            }());
            fastifyInstance.all("".concat(healthCheckRoutesPrefix, "/test-api-error"), function (req, res) {
              var _ref5 = req.query || req.body,
                code = _ref5.code;
              throw new ApiError('Test ApiError', 'ERR_CODE', code || 400, {
                foo: 'bar'
              });
            });
            fastifyInstance.all("".concat(healthCheckRoutesPrefix, "/test-uncaught-error"), function (req, res) {
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
                data: data,
                meta: meta
              });
            });
          }

          /**********************************************
           * Register routes and start listening
           * The exported module must be a function that returns a fastify plugin
           **********************************************/
          appDirectory = resolveRouteDirectory(basePath, appConfig);
          _context5.n = 1;
          return discoverRouteFiles(appDirectory);
        case 1:
          apiFiles = _context5.v;
          routeEntries = apiFiles.map(function (apiFile) {
            return {
              apiFile: apiFile,
              prefix: buildRoutePrefix(apiFile, appDirectory, appConfig)
            };
          });
          _context5.n = 2;
          return Promise.all(routeEntries.map(function (_ref6) {
            var apiFile = _ref6.apiFile;
            return function (specifier) {
              return new Promise(function (r) {
                return r("".concat(specifier));
              }).then(function (s) {
                return _interopRequireWildcard(require(s));
              });
            }((0, _nodeUrl.pathToFileURL)(apiFile).href);
          }));
        case 2:
          importedModules = _context5.v;
          routeEntries.forEach(function (_ref7, index) {
            var apiFile = _ref7.apiFile,
              prefix = _ref7.prefix;
            fastifyInstance.register(resolveRoutePlugin(importedModules[index], apiFile), {
              prefix: prefix
            });
          });
          return _context5.a(2, fastifyInstance);
      }
    }, _callee5);
  }));
  return _init.apply(this, arguments);
}
function start() {
  return _start.apply(this, arguments);
}
function _start() {
  _start = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var address, _t;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return fastifyInstance.listen(configCopy.server);
        case 1:
          address = _context6.v;
          console.log('\x1b[32m%s\x1b[0m', "HTTP Server now listening on ".concat(address));
          return _context6.a(2, fastifyInstance);
        case 2:
          _context6.p = 2;
          _t = _context6.v;
          console.log(_t);
          throw _t;
        case 3:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return _start.apply(this, arguments);
}
var instanceProxy = new Proxy({}, {
  get: function get(target, prop) {
    if (!fastifyInstance) return undefined;
    return fastifyInstance[prop];
  },
  apply: function apply(target, thisArg, args) {
    if (!fastifyInstance) return undefined;
    return Reflect.apply(fastifyInstance, thisArg, args);
  }
});
var _default = exports["default"] = instanceProxy;