'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t5 in e) "default" !== _t5 && {}.hasOwnProperty.call(e, _t5) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t5)) && (i.get || i.set) ? o(f, _t5, i) : f[_t5] = e[_t5]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
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
 * @property {boolean} [app.disableLogRequestBody] - Whether to disable logging request body
 * @property {boolean} [app.disableLogRequestHeaders] - Whether to disable logging request headers
 * @property {boolean} [app.disableSendRequestIdHeader] - Whether to disable sending request ID in response headers
 * @property {boolean} [app.disableApiErrorHandler] - Whether to disable API error handler
 * @property {boolean} [app.disableLogApiError] - Whether to disable logging API errors
 * @property {boolean} [app.disableHealthCheckRoutes] - Whether to disable health check routes
 * @property {string} [app.healthCheckRoutesPrefix] - Prefix for health check routes
 * @property {boolean} [app.enableHealthCheckShowsGitRev] - Whether to show git revision in health check response
 * @property {boolean} [app.disableAddRequestState] - Whether to disable adding state object to request
 * @property {boolean} [app.disableReplyHelperFunctions] - Whether to disable reply helper functions
 * @property {number} [app.internalServerErrorCode] - Status code for internal server errors
 * @property {Array} [app.sensitiveHeaders] - List of sensitive headers to be excluded from logs
 * @property {Object} [server] - Server configuration for listening
 */
var fastifyInstance;
var configCopy;

/**
 * Initialize a new Fastify instance with configured plugins and hooks.
 * @param {FastifyConfig} config - Configuration object for the application
 * @returns {Object} Fastify instance with added methods
 */
function init(_x) {
  return _init.apply(this, arguments);
}
function _init() {
  _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(config) {
    var _config$app, _config$app2, _config$app3, _config$app7, _config$app8, _config$app1, _config$app14, _config$app15;
    var filterHeaders, _config$app0, _config$app10, _config$app$healthChe, _config$app11, _config$app$healthChe2, _config$app12, _config$app$healthChe3, _config$app13, rev, basePath, apiFiles, _iterator2, _step2, apiFile, filename, length, prefix, _t, _t2, _t3, _t4;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          configCopy = _objectSpread({}, config);
          /************************************
           * Initialize fastify and put it in global
           ************************************/
          fastifyInstance = (0, _fastify["default"])(Object.assign({
            logger: true,
            trustProxy: true,
            disableRequestLogging: false,
            bodyLimit: 52428800 //in bytes, 50Mb
          }, config.fastify));

          /************************************
           * Register cors plugin
           ************************************/
          if (!((_config$app = config.app) !== null && _config$app !== void 0 && _config$app.disableCors)) {
            fastifyInstance.register(_cors["default"]);
          }

          /************************************
           * Log request body and headers
           ************************************/
          if (!((_config$app2 = config.app) !== null && _config$app2 !== void 0 && _config$app2.disableLogRequestBody) || !(config !== null && config !== void 0 && (_config$app3 = config.app) !== null && _config$app3 !== void 0 && _config$app3.disableLogRequestHeaders)) {
            filterHeaders = function filterHeaders(headers) {
              var _config$app4;
              var SENSITIVE_HEADERS = _toConsumableArray((config === null || config === void 0 || (_config$app4 = config.app) === null || _config$app4 === void 0 ? void 0 : _config$app4.sensitiveHeaders) || []);
              var filtered = _objectSpread({}, headers);
              var _iterator = _createForOfIteratorHelper(SENSITIVE_HEADERS),
                _step;
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var key = _step.value;
                  if (filtered[key]) filtered[key] = '[FILTERED]';
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              return filtered;
            };
            fastifyInstance.addHook('preHandler', function (req, res, done) {
              var _config$app5, _config$app6;
              var logContent = {
                url: req.url
              };
              if (!(config !== null && config !== void 0 && (_config$app5 = config.app) !== null && _config$app5 !== void 0 && _config$app5.disableLogRequestBody) && req.headers['content-type'] === 'application/json') {
                var clone = null;
                if (req.body && parseInt(req.headers['content-length']) > 1000) {
                  clone = JSON.parse(JSON.stringify(req.body));
                  for (var key in clone) {
                    if (clone[key] && clone[key].length > 255) {
                      clone[key] = clone[key].slice(0, 255) + '...';
                    }
                  }
                }
                logContent.body = clone || req.body;
              }
              if (!((_config$app6 = config.app) !== null && _config$app6 !== void 0 && _config$app6.disableLogRequestHeaders)) {
                logContent.headers = filterHeaders(req.headers);
              }
              req.log.info(logContent);
              done();
            });
          }

          /************************************
           * Add Request ID to response headers
           ***********************************/
          if (!(config !== null && config !== void 0 && (_config$app7 = config.app) !== null && _config$app7 !== void 0 && _config$app7.disableSendRequestIdHeader)) {
            fastifyInstance.addHook('onSend', function (req, res, payload, done) {
              res.header('Request-ID', req.id);
              done();
            });
          }

          /************************************
           * Register CustomErrorHandler
           * **********************************/
          if (!(config !== null && config !== void 0 && (_config$app8 = config.app) !== null && _config$app8 !== void 0 && _config$app8.disableApiErrorHandler)) {
            fastifyInstance.setErrorHandler(function (error, req, res) {
              if (error instanceof ApiError) {
                res.status(error.statusCode).send({
                  status: 'error',
                  message: error.message,
                  code: error.code,
                  data: error.data
                });
              } else {
                var _config$app9;
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
                res.status((config === null || config === void 0 || (_config$app9 = config.app) === null || _config$app9 === void 0 ? void 0 : _config$app9.internalServerErrorCode) || 200).send(err);
              }
            });
            if (!(config !== null && config !== void 0 && (_config$app0 = config.app) !== null && _config$app0 !== void 0 && _config$app0.disableLogApiError)) {
              fastifyInstance.addHook('onError', function (req, res, error, done) {
                if (error instanceof ApiError) {
                  res.log.error({
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
          if (!(config !== null && config !== void 0 && (_config$app1 = config.app) !== null && _config$app1 !== void 0 && _config$app1.disableHealthCheckRoutes)) {
            rev = 'unknown';
            if (config !== null && config !== void 0 && (_config$app10 = config.app) !== null && _config$app10 !== void 0 && _config$app10.enableHealthCheckShowsGitRev) {
              try {
                rev = (0, _nodeChild_process.execSync)('git rev-parse HEAD').toString().trim();
              } catch (e) {
                rev = 'unknown';
              }
            }
            fastifyInstance.all(((_config$app$healthChe = config === null || config === void 0 || (_config$app11 = config.app) === null || _config$app11 === void 0 ? void 0 : _config$app11.healthCheckRoutesPrefix) !== null && _config$app$healthChe !== void 0 ? _config$app$healthChe : '') + '/ping', /*#__PURE__*/function () {
              var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
                var _req$body, _req$query;
                return _regenerator().w(function (_context) {
                  while (1) switch (_context.n) {
                    case 0:
                      res.ok({
                        ping: 'pong',
                        echo: ((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.echo) || ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.echo) || new Date().toLocaleString(),
                        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        rev: rev,
                        random: Math.random() * Math.random()
                      });
                    case 1:
                      return _context.a(2);
                  }
                }, _callee);
              }));
              return function (_x2, _x3) {
                return _ref.apply(this, arguments);
              };
            }());
            fastifyInstance.all(((_config$app$healthChe2 = config === null || config === void 0 || (_config$app12 = config.app) === null || _config$app12 === void 0 ? void 0 : _config$app12.healthCheckRoutesPrefix) !== null && _config$app$healthChe2 !== void 0 ? _config$app$healthChe2 : '') + '/test-api-error', function (req, res) {
              var _ref2 = req.query || req.body,
                code = _ref2.code;
              throw new ApiError('Test ApiError', 'ERR_CODE', code || 400, {
                foo: 'bar'
              });
            });
            fastifyInstance.all(((_config$app$healthChe3 = config === null || config === void 0 || (_config$app13 = config.app) === null || _config$app13 === void 0 ? void 0 : _config$app13.healthCheckRoutesPrefix) !== null && _config$app$healthChe3 !== void 0 ? _config$app$healthChe3 : '') + '/test-uncaught-error', function (req, res) {
              throw new Error('Test uncaught error');
            });
          }

          /************************************
           * Add state object to the request
           * **********************************/
          if (!(config !== null && config !== void 0 && (_config$app14 = config.app) !== null && _config$app14 !== void 0 && _config$app14.disableAddRequestState)) {
            fastifyInstance.decorateRequest('state', null);
            fastifyInstance.addHook('onRequest', function (req, res, done) {
              req.state = {};
              done();
            });
          }

          /************************************
           * Reply Helper Functions
           * **********************************/
          if (!(config !== null && config !== void 0 && (_config$app15 = config.app) !== null && _config$app15 !== void 0 && _config$app15.disableReplyHelperFunctions)) {
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
          basePath = process.cwd();
          apiFiles = _fastGlob["default"].sync(_nodePath["default"].join(basePath, 'app/**/*.{js,mjs,ts}'), {
            onlyFiles: true
          });
          _iterator2 = _createForOfIteratorHelper(apiFiles);
          _context2.p = 1;
          _iterator2.s();
        case 2:
          if ((_step2 = _iterator2.n()).done) {
            _context2.n = 6;
            break;
          }
          apiFile = _step2.value;
          filename = apiFile.split(_nodePath["default"].sep).pop();
          if (!filename.startsWith('_')) {
            _context2.n = 3;
            break;
          }
          return _context2.a(3, 5);
        case 3:
          length = _nodePath["default"].join(basePath, 'app/').length;
          prefix = apiFile.slice(length, -(filename.length + 1));
          _t = fastifyInstance;
          _context2.n = 4;
          return function (specifier) {
            return new Promise(function (r) {
              return r("".concat(specifier));
            }).then(function (s) {
              return _interopRequireWildcard(require(s));
            });
          }(apiFile);
        case 4:
          _t2 = _context2.v["default"]();
          _t3 = {
            prefix: prefix
          };
          _t.register.call(_t, _t2, _t3);
        case 5:
          _context2.n = 2;
          break;
        case 6:
          _context2.n = 8;
          break;
        case 7:
          _context2.p = 7;
          _t4 = _context2.v;
          _iterator2.e(_t4);
        case 8:
          _context2.p = 8;
          _iterator2.f();
          return _context2.f(8);
        case 9:
          return _context2.a(2, fastifyInstance);
      }
    }, _callee2, null, [[1, 7, 8, 9]]);
  }));
  return _init.apply(this, arguments);
}
function start() {
  return _start.apply(this, arguments);
}
function _start() {
  _start = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          return _context3.a(2, new Promise(function (resolve, reject) {
            fastifyInstance.listen(configCopy.server, function (err, address) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                console.log('\x1b[32m%s\x1b[0m', "HTTP Server now listening on ".concat(address));
                resolve(fastifyInstance);
              }
            });
          }));
      }
    }, _callee3);
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