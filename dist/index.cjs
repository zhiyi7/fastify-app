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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
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
  _init = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(config) {
    var _config$app, _config$app2, _config$app3, _config$app6, _config$app7, _config$app10, _config$app15, _config$app16;
    var _config$app9, _config$app11, _config$app$healthChe, _config$app12, _config$app$healthChe2, _config$app13, _config$app$healthChe3, _config$app14, rev, basePath, apiFiles, _iterator, _step, apiFile, filename, length, prefix;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
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
            fastifyInstance.addHook('preHandler', function (req, res, done) {
              var _config$app4, _config$app5;
              var logContent = {
                url: req.url
              };
              if (!(config !== null && config !== void 0 && (_config$app4 = config.app) !== null && _config$app4 !== void 0 && _config$app4.disableLogRequestBody) && req.headers['content-type'] === 'application/json') {
                var clone = null;
                if (req.body && req.headers['content-length'] > 1000) {
                  clone = JSON.parse(JSON.stringify(req.body));
                  for (var key in clone) {
                    if (clone[key] && clone[key].length > 255) {
                      clone[key] = clone[key].slice(0, 255) + '...';
                    }
                  }
                }
                logContent.body = clone || req.body;
              }
              if (!((_config$app5 = config.app) !== null && _config$app5 !== void 0 && _config$app5.disableLogRequestHeaders)) {
                logContent.headers = req.headers;
              }
              req.log.info(logContent);
              done();
            });
          }

          /************************************
           * Add Request ID to response headers
           ***********************************/
          if (!(config !== null && config !== void 0 && (_config$app6 = config.app) !== null && _config$app6 !== void 0 && _config$app6.disableSendRequestIdHeader)) {
            fastifyInstance.addHook('onSend', function (req, res, payload, done) {
              res.header('Request-ID', req.id);
              done();
            });
          }

          /************************************
           * Register CustomErrorHandler
           * **********************************/
          if (!(config !== null && config !== void 0 && (_config$app7 = config.app) !== null && _config$app7 !== void 0 && _config$app7.disableApiErrorHandler)) {
            fastifyInstance.setErrorHandler(function (error, req, res) {
              if (error instanceof ApiError) {
                res.status(error.statusCode).send({
                  status: 'error',
                  message: error.message,
                  code: error.code,
                  data: error.data
                });
              } else {
                var _config$app8;
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
                res.status((config === null || config === void 0 || (_config$app8 = config.app) === null || _config$app8 === void 0 ? void 0 : _config$app8.internalServerErrorCode) || 200).send(err);
              }
            });
            if (!(config !== null && config !== void 0 && (_config$app9 = config.app) !== null && _config$app9 !== void 0 && _config$app9.disableLogApiError)) {
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
          if (!(config !== null && config !== void 0 && (_config$app10 = config.app) !== null && _config$app10 !== void 0 && _config$app10.disableHealthCheckRoutes)) {
            rev = 'unknown';
            if (config !== null && config !== void 0 && (_config$app11 = config.app) !== null && _config$app11 !== void 0 && _config$app11.enableHealthCheckShowsGitRev) {
              try {
                rev = (0, _nodeChild_process.execSync)('git rev-parse HEAD').toString().trim();
              } catch (e) {
                rev = 'unknown';
              }
            }
            fastifyInstance.all(((_config$app$healthChe = config === null || config === void 0 || (_config$app12 = config.app) === null || _config$app12 === void 0 ? void 0 : _config$app12.healthCheckRoutesPrefix) !== null && _config$app$healthChe !== void 0 ? _config$app$healthChe : '') + '/ping', /*#__PURE__*/function () {
              var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
                var _req$body, _req$query;
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      res.ok({
                        ping: 'pong',
                        echo: ((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.echo) || ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.echo) || new Date().toLocaleString(),
                        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        rev: rev,
                        random: Math.random() * Math.random()
                      });
                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }));
              return function (_x2, _x3) {
                return _ref.apply(this, arguments);
              };
            }());
            fastifyInstance.all(((_config$app$healthChe2 = config === null || config === void 0 || (_config$app13 = config.app) === null || _config$app13 === void 0 ? void 0 : _config$app13.healthCheckRoutesPrefix) !== null && _config$app$healthChe2 !== void 0 ? _config$app$healthChe2 : '') + '/test-api-error', function (req, res) {
              var _ref2 = req.query || req.body,
                code = _ref2.code;
              throw new ApiError('Test ApiError', 'ERR_CODE', code || 400, {
                foo: 'bar'
              });
            });
            fastifyInstance.all(((_config$app$healthChe3 = config === null || config === void 0 || (_config$app14 = config.app) === null || _config$app14 === void 0 ? void 0 : _config$app14.healthCheckRoutesPrefix) !== null && _config$app$healthChe3 !== void 0 ? _config$app$healthChe3 : '') + '/test-uncaught-error', function (req, res) {
              throw new Error('Test uncaught error');
            });
          }

          /************************************
           * Add state object to the request
           * **********************************/
          if (!(config !== null && config !== void 0 && (_config$app15 = config.app) !== null && _config$app15 !== void 0 && _config$app15.disableAddRequestState)) {
            fastifyInstance.decorateRequest('state', null);
            fastifyInstance.addHook('onRequest', function (req, res, done) {
              req.state = {};
              done();
            });
          }

          /************************************
           * Reply Helper Functions
           * **********************************/
          if (!(config !== null && config !== void 0 && (_config$app16 = config.app) !== null && _config$app16 !== void 0 && _config$app16.disableReplyHelperFunctions)) {
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
          _iterator = _createForOfIteratorHelper(apiFiles);
          _context2.prev = 12;
          _iterator.s();
        case 14:
          if ((_step = _iterator.n()).done) {
            _context2.next = 29;
            break;
          }
          apiFile = _step.value;
          filename = apiFile.split(_nodePath["default"].sep).pop();
          if (!filename.startsWith('_')) {
            _context2.next = 19;
            break;
          }
          return _context2.abrupt("continue", 27);
        case 19:
          length = _nodePath["default"].join(basePath, 'app/').length;
          prefix = apiFile.slice(length, -(filename.length + 1));
          _context2.t0 = fastifyInstance;
          _context2.next = 24;
          return function (specifier) {
            return new Promise(function (r) {
              return r("".concat(specifier));
            }).then(function (s) {
              return _interopRequireWildcard(require(s));
            });
          }(apiFile);
        case 24:
          _context2.t1 = _context2.sent["default"]();
          _context2.t2 = {
            prefix: prefix
          };
          _context2.t0.register.call(_context2.t0, _context2.t1, _context2.t2);
        case 27:
          _context2.next = 14;
          break;
        case 29:
          _context2.next = 34;
          break;
        case 31:
          _context2.prev = 31;
          _context2.t3 = _context2["catch"](12);
          _iterator.e(_context2.t3);
        case 34:
          _context2.prev = 34;
          _iterator.f();
          return _context2.finish(34);
        case 37:
          return _context2.abrupt("return", fastifyInstance);
        case 38:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[12, 31, 34, 37]]);
  }));
  return _init.apply(this, arguments);
}
function start() {
  return _start.apply(this, arguments);
}
function _start() {
  _start = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
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
        case 1:
        case "end":
          return _context3.stop();
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