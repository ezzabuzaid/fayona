module.exports = (() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    define("app/core/utils/logger.service", ["require", "exports", "ansi-colors"], function (require, exports, colors) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var LogLevel;
        (function (LogLevel) {
            LogLevel[LogLevel["Off"] = 0] = "Off";
            LogLevel[LogLevel["Error"] = 1] = "Error";
            LogLevel[LogLevel["Warning"] = 2] = "Warning";
            LogLevel[LogLevel["Info"] = 3] = "Info";
            LogLevel[LogLevel["Debug"] = 4] = "Debug";
        })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
        class Logger {
            constructor(source) {
                this.source = source;
                this.log(console.log, LogLevel.Info, [colors.bold(source)]);
            }
            static enableProductionMode() {
                Logger.level = LogLevel.Warning;
            }
            debug(...objects) {
                this.colorizeText(objects, 'cyan');
                this.log(console.log, LogLevel.Debug, objects);
            }
            info(...objects) {
                this.colorizeText(objects, 'green');
                this.log(console.info, LogLevel.Info, objects);
            }
            warn(...objects) {
                this.colorizeText(objects, 'yellow');
                this.log(console.warn, LogLevel.Warning, objects);
            }
            error(...objects) {
                this.colorizeText(objects, 'red');
                this.log(console.error, LogLevel.Error, objects);
            }
            log(func, level, objects) {
                if (level <= Logger.level) {
                    const log = this.source ? ['[' + colors.bgBlack(colors.bold(this.source)) + ']'].concat(objects) : objects;
                    func.apply(console, log);
                    Logger.outputs.forEach(output => output.apply(output, [this.source, level].concat(objects)));
                }
            }
            colorizeText(objects, color) {
                objects.forEach((el, index) => {
                    if (typeof el === 'string') {
                        objects[index] = colors[color](el);
                    }
                });
            }
        }
        Logger.level = LogLevel.Debug;
        Logger.outputs = [];
        exports.Logger = Logger;
    });
    define("app/core/utils/utils.service", ["require", "exports", "tslib", "setprototypeof", "crypto", "axios"], function (require, exports, tslib_1, setPrototypeOf, crypto_1, axios_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        axios_1 = tslib_1.__importDefault(axios_1);
        class AppUtils {
            static setPrototypeOf(constructor, superConstructor) {
                setPrototypeOf(constructor, superConstructor);
            }
            static getPrototypeOf(constructor) {
                return Object.getPrototypeOf(constructor);
            }
            static cloneObject(obj) {
                var clone = {};
                for (var i in obj) {
                    if (obj[i] != null && typeof (obj[i]) == "object")
                        clone[i] = this.cloneObject(obj[i]);
                    else
                        clone[i] = obj[i];
                }
                return clone;
            }
            static defineProperty(prototype, propertyKey, options) {
                Object.defineProperty(prototype, propertyKey, Object.assign({ enumerable: false, configurable: false }, options));
            }
            static joinPath(...path) {
                const connectedPath = path.join('/');
                const cleanedPath = connectedPath.split('/').filter(path => !!path);
                cleanedPath.unshift(null);
                return cleanedPath.join('/');
            }
            static generateHash() {
                return crypto_1.randomBytes(20).toString('hex');
            }
            static getter(object) {
                return Object.keys(object).filter(el => typeof object[el].get === 'function');
            }
            static setter(object) {
                return Object.keys(object).filter(el => typeof object[el].set === 'function');
            }
            static methods(object) {
                return Object.keys(object).filter(el => typeof object[el].value === 'function');
            }
            static Schema(name) {
                return function (constructor) {
                    return class {
                    };
                };
            }
            static removeKey(key, obj) {
                const _a = key, foo = obj[_a], rest = tslib_1.__rest(obj, [typeof _a === "symbol" ? _a : _a + ""]);
                return rest;
            }
            static pick(obj, keys) {
                return Object.assign({}, Object.assign({}, keys.map(k => k in obj ? { [k]: obj[k] } : {})));
            }
            static reject(obj, keys) {
                return Object.assign({}, ...Object.keys(obj).filter(k => !keys.includes(k)).map(k => ({ [k]: obj[k] })));
            }
            static getHtml(uri) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const { data } = yield axios_1.default.get(uri);
                    return data;
                });
            }
        }
        exports.AppUtils = AppUtils;
        class Singelton {
            static build() {
                return this.instance || (this.instance = new this());
            }
        }
        Singelton.instance = null;
        exports.Singelton = Singelton;
    });
    define("app/core/utils/index", ["require", "exports", "tslib", "app/core/utils/utils.service", "app/core/utils/logger.service"], function (require, exports, tslib_2, utils_service_1, logger_service_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_2.__exportStar(utils_service_1, exports);
        tslib_2.__exportStar(logger_service_1, exports);
    });
    define("environment/env", ["require", "exports", "dotenv", "path", "app/core/utils/index"], function (require, exports, dotenv_1, path_1, utils_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_1.Logger('Envirnoment Class');
        class Envirnoment {
            constructor() {
                this.env = {};
            }
            load(state = EnvirnomentStages.DEV) {
                const { error, parsed } = dotenv_1.config({ path: path_1.join(__dirname, `.env.${state}`) });
                if (error) {
                    log.debug(error);
                    // throw new Error('an error accourd while loading the env file');
                }
                this.env = parsed;
                return parsed;
            }
            set(envKey, value) {
                const key = this.env[envKey];
                if (!key) {
                    log.warn(`you're about adding a new key to the environment ${envKey}`);
                }
                this.env[envKey] = value;
                return value;
            }
            get(envKey) {
                return '';
            }
        }
        var EnvirnomentStages;
        (function (EnvirnomentStages) {
            EnvirnomentStages["DEV"] = "dev";
            EnvirnomentStages["TEST"] = "test";
            EnvirnomentStages["PROD"] = "prod";
        })(EnvirnomentStages = exports.EnvirnomentStages || (exports.EnvirnomentStages = {}));
        exports.envirnoment = new Envirnoment;
    });
    define("lib/typing/router-option", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var RouterProperties;
        (function (RouterProperties) {
            RouterProperties["RoutesPath"] = "routeUri";
            RouterProperties["ID"] = "id";
        })(RouterProperties = exports.RouterProperties || (exports.RouterProperties = {}));
    });
    define("lib/typing/index", ["require", "exports", "tslib", "lib/typing/router-option"], function (require, exports, tslib_3, router_option_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_3.__exportStar(router_option_1, exports);
    });
    define("app/core/helpers/network-status", ["require", "exports", "http-status-codes"], function (require, exports, hsc) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.NetworkStatus = hsc;
    });
    define("app/shared/models/response.model", ["require", "exports", "app/core/helpers/network-status"], function (require, exports, network_status_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Response extends Error {
        }
        class SuccessResponse extends Response {
            constructor(data, message, code = network_status_1.NetworkStatus.OK, status) {
                super();
                this.name = SuccessResponse.name;
                this.message = message;
                this.code = code;
                this.data = data;
                this.status = status || network_status_1.NetworkStatus.getStatusText(code);
            }
        }
        exports.SuccessResponse = SuccessResponse;
        class ErrorResponse extends Response {
            constructor(message, code = network_status_1.NetworkStatus.BAD_REQUEST, status) {
                super();
                this.name = ErrorResponse.name;
                this.message = message;
                this.code = code;
                this.status = status || network_status_1.NetworkStatus.getStatusText(code);
            }
        }
        exports.ErrorResponse = ErrorResponse;
    });
    define("app/core/helpers/hash", ["require", "exports", "app/core/utils/index", "bcryptjs"], function (require, exports, utils_2, bcrypt) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_2.Logger('Hash service');
        class HashService {
            constructor() {
                log.info('Hash service constructor !');
            }
            static hashText(text) {
                return bcrypt.hash(text, 10);
            }
            static hashPassword(text) {
                log.info('Start hashing password');
                return this.hashText(text);
            }
            static comparePassword(candidatePassword, actualPassword) {
                log.info('Start comparePassword');
                return bcrypt.compare(candidatePassword, actualPassword);
            }
        }
        exports.HashService = HashService;
    });
    define("lib/localization/local", ["require", "exports", "app/core/helpers/index", "app/core/utils/index"], function (require, exports, helpers_1, utils_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_3.Logger('Local Class');
        class Local {
            constructor(name, language) {
                this.name = name;
                this._language = language;
            }
            get language() {
                return this._language;
            }
            set(key, value) {
                helpers_1.development(() => {
                    log.warn(`a key with name ${key} is already hold a value`);
                });
                this.language[key] = value;
            }
            get(key) {
                const value = this.language[key];
                if (!value) {
                    throw new Error(`the key { ${key} } is not found in local { ${this.name} }`);
                }
                return value;
            }
        }
        exports.Local = Local;
    });
    define("app/core/config/observer", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Observer {
            constructor(subject) {
                subject.subscribe((arg) => { console.log(arg); });
            }
            update(notifcation) {
            }
        }
        exports.Observer = Observer;
        class Subject {
            constructor() {
                this.observers = [];
            }
            countObservers() {
                return this.observers.length;
            }
            get(observer) {
                return typeof observer === 'number' ? this.observers[observer] : this.observers.find(_observer => _observer === observer);
            }
            subscribe(observer) {
                this.observers.push(observer);
            }
            unsubscribe(observer) {
                const index = this.observers.findIndex(_observer => _observer === observer);
                observer = this.observers.splice(index, 1);
            }
            notify(notifcation) {
                this.observers.forEach(observer => observer.update(notifcation));
            }
        }
        exports.Subject = Subject;
    });
    define("app/core/config/reactor", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Broadcast {
            constructor(name) {
                this.callbacks = [];
                this.name = name;
            }
            registerCallback(func) {
                this.callbacks.push(func);
            }
        }
        class Reactor {
            constructor(name) {
                this.event = new Broadcast(name);
                this.name = name;
                this.index = Reactor.eventNumber++;
                Reactor.events.push(this.event);
            }
            static getEvent(name) {
                const event = this.events.find(event => event.name === name);
                if (!event)
                    throw new Error('Event cannot find!');
                return event;
            }
            static listen(name, func) {
                const event = this.getEvent(name);
                event.registerCallback(func);
            }
            emit(value) {
                this.event.callbacks.forEach(func => func(value));
            }
            register(func) {
                this.event.registerCallback(func);
            }
            unregister() {
                let ref = Reactor.events.splice(this.index, 1)[0];
                ref = null;
                this.event = null;
            }
        }
        Reactor.events = [];
        Reactor.eventNumber = 0;
        exports.Reactor = Reactor;
    });
    define("app/core/config/index", ["require", "exports", "tslib", "app/core/config/observer", "app/core/config/reactor"], function (require, exports, tslib_4, observer_1, reactor_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_4.__exportStar(observer_1, exports);
        tslib_4.__exportStar(reactor_1, exports);
    });
    define("lib/localization/localization.service", ["require", "exports", "app/core/config/index", "app/core/utils/index"], function (require, exports, config_1, utils_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_4.Logger('LocalizationService Class');
        class LocalizationService {
            constructor() {
                this.eventName = 'localization';
                this._localAdd = new config_1.Reactor(`${this.eventName}_add`);
                this._localChange = new config_1.Reactor(`${this.eventName}_change`);
            }
            get localAdded() {
                return this._localAdd;
            }
            get localChange() {
                return this._localChange;
            }
        }
        exports.LocalizationService = LocalizationService;
    });
    define("lib/localization/localization", ["require", "exports", "lib/localization/local", "lib/localization/localization.service", "app/core/helpers/index", "app/core/utils/index"], function (require, exports, local_1, localization_service_1, helpers_2, utils_5) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_5.Logger('Localization Class');
        class Localization extends localization_service_1.LocalizationService {
            constructor() {
                super();
                this.locals = [];
            }
            add(name, local) {
                helpers_2.development(() => {
                    if (this.get(name)) {
                        throw new Error(`Local ${name} is already exist`);
                    }
                });
                const newLocal = new local_1.Local(name, local);
                this.locals.push(newLocal);
                this.localAdded.emit(local);
                log.info(`local with name ${name} is added, consider using set(local) to use it`);
                return newLocal;
            }
            use(name) {
                const local = this.get(name);
                if (!local) {
                    throw new Error('local not found, please consider add it');
                }
                this.local = local;
                this.localChange.emit(local);
                log.info(`local with name ${name} is active`);
                return local;
            }
            get(name) {
                const local = this.locals.find(loc => loc.name === name);
                return local || null;
            }
            get local() {
                return this._local;
            }
            set local(local) {
                this._local = local;
            }
        }
        const localization = new Localization();
        exports.localization = localization;
        function translate(key, params = {}) {
            let value = localization.local.get(key);
            const rawParams = value.match(/\{(.*?)\}/ig);
            if (rawParams) {
                value = rawParams.reduce((acc, el) => {
                    const param = el.substring(1, el.length - 1);
                    return acc += value.replace(/\{(.*?)\}/, params[param]);
                }, '');
            }
            return value;
        }
        exports.translate = translate;
    });
    define("lib/localization/index", ["require", "exports", "tslib", "lib/localization/local", "lib/localization/localization"], function (require, exports, tslib_5, local_2, localization_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_5.__exportStar(local_2, exports);
        tslib_5.__exportStar(localization_1, exports);
    });
    define("app/core/helpers/errors", ["require", "exports", "app/core/helpers/index", "lib/localization/index", "app/core/utils/index", "app/core/helpers/network-status"], function (require, exports, helpers_3, localization_2, utils_6, network_status_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_6.Logger('Errors');
        var Errors;
        (function (Errors) {
            Errors["CastError"] = "CastError";
            Errors["AssertionError"] = "AssertionError";
            Errors["MongoError"] = "MongoError";
            Errors["ErrorResponse"] = "ErrorResponse";
            Errors["SuccessResponse"] = "SuccessResponse";
            Errors["JsonWebTokenError"] = "JsonWebTokenError";
            Errors["ValidationError"] = "ValidationError";
        })(Errors = exports.Errors || (exports.Errors = {}));
        class ErrorHandling {
            static catchError(error, req, res, next) {
                const response = new helpers_3.ErrorResponse(error.message, error.code || network_status_2.NetworkStatus.INTERNAL_SERVER_ERROR);
                switch (error.name) {
                    case Errors.CastError:
                        response.message = localization_2.translate('invalid_syntax');
                        response.code = network_status_2.NetworkStatus.BAD_REQUEST;
                        break;
                    case Errors.ValidationError:
                        response.code = network_status_2.NetworkStatus.BAD_REQUEST;
                        break;
                }
                log.error(error.name);
                res.status(response.code).json(response);
                return;
            }
            static throwError(message, code = network_status_2.NetworkStatus.INTERNAL_SERVER_ERROR) {
                throw new helpers_3.ErrorResponse(message, code);
            }
            static notFound(req, res, next) {
                const error = new helpers_3.ErrorResponse(`${req.originalUrl} => ${localization_2.translate('endpoint_not_found')}`, network_status_2.NetworkStatus.NOT_FOUND);
                return res.status(error.code).json(error);
            }
            static favIcon(req, res, next) {
                if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
                    return res.sendStatus(204);
                }
                return next();
            }
            static wrapRoute(...func) {
                return func.map(fn => (...args) => fn(...args).catch(args[2]));
            }
        }
        exports.ErrorHandling = ErrorHandling;
    });
    define("app/core/helpers/stages", ["require", "exports", "app/server"], function (require, exports, server_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var ServerLevel;
        (function (ServerLevel) {
            ServerLevel[ServerLevel["OFF"] = 0] = "OFF";
            ServerLevel[ServerLevel["DEV"] = 1] = "DEV";
            ServerLevel[ServerLevel["TEST"] = 2] = "TEST";
            ServerLevel[ServerLevel["STAGE"] = 3] = "STAGE";
            ServerLevel[ServerLevel["PROD"] = 4] = "PROD";
        })(ServerLevel = exports.ServerLevel || (exports.ServerLevel = {}));
        function development(cb, level = server_1.Server.LEVEL) {
            if (ServerLevel.DEV <= level) {
                cb();
            }
        }
        exports.development = development;
        function production(cb, level = server_1.Server.LEVEL) {
            if (ServerLevel.PROD <= level) {
                cb();
            }
        }
        exports.production = production;
        function testing(cb, level = server_1.Server.LEVEL) {
            if (ServerLevel.TEST <= level) {
                cb();
            }
        }
        exports.testing = testing;
    });
    define("app/core/helpers/url", ["require", "exports", "url"], function (require, exports, url_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Url extends url_1.URL {
            constructor(obj) {
                super('', obj);
            }
        }
        exports.Url = Url;
    });
    define("app/core/helpers/index", ["require", "exports", "tslib", "app/shared/models/response.model", "app/core/helpers/hash", "app/core/helpers/errors", "app/core/helpers/stages", "app/core/helpers/errors", "app/core/helpers/url", "app/core/helpers/network-status"], function (require, exports, tslib_6, response_model_1, hash_1, errors_1, stages_1, errors_2, url_2, network_status_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_6.__exportStar(response_model_1, exports);
        tslib_6.__exportStar(hash_1, exports);
        tslib_6.__exportStar(errors_1, exports);
        tslib_6.__exportStar(stages_1, exports);
        tslib_6.__exportStar(errors_2, exports);
        tslib_6.__exportStar(url_2, exports);
        tslib_6.__exportStar(network_status_3, exports);
    });
    define("lib/methods/get.decorator", ["require", "exports", "app/core/utils/index", "app/core/helpers/index"], function (require, exports, utils_7, helpers_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function Get(uri, ...middlewares) {
            return function (target, propertyKey, descriptor) {
                const method = descriptor.value;
                descriptor.value = function () {
                    return method.apply(target, arguments);
                };
                setTimeout(() => {
                    uri = utils_7.AppUtils.joinPath(target.routeUri, '/', uri);
                    target.get(uri, helpers_4.ErrorHandling.wrapRoute(...middlewares, function () {
                        return target[propertyKey](...arguments);
                    }));
                }, 0);
            };
        }
        exports.Get = Get;
    });
    define("lib/methods/post.decorator", ["require", "exports", "app/core/utils/index", "app/core/helpers/errors"], function (require, exports, utils_8, errors_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function Post(uri, ...middlewares) {
            return function (target, propertyKey, descriptor) {
                const method = descriptor.value;
                descriptor.value = function () {
                    return method.apply(target, arguments);
                };
                setTimeout(() => {
                    uri = utils_8.AppUtils.joinPath(target.routeUri, '/', uri);
                    target.post(uri, errors_3.ErrorHandling.wrapRoute(...middlewares, function () {
                        return target[propertyKey](...arguments);
                    }));
                }, 0);
            };
        }
        exports.Post = Post;
    });
    define("lib/methods/put.decorator", ["require", "exports", "app/core/helpers/index", "app/core/utils/index"], function (require, exports, helpers_5, utils_9) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function Put(uri, ...middlewares) {
            return function (target, propertyKey, descriptor) {
                const method = descriptor.value;
                descriptor.value = function () {
                    return method.apply(target, arguments);
                };
                setTimeout(() => {
                    uri = utils_9.AppUtils.joinPath(target.routeUri, '/', uri);
                    target.put(uri, helpers_5.ErrorHandling.wrapRoute(...middlewares, function () {
                        return target[propertyKey](...arguments);
                    }));
                }, 0);
            };
        }
        exports.Put = Put;
    });
    define("lib/methods/delete.decorator", ["require", "exports", "app/core/helpers/index", "app/core/utils/index"], function (require, exports, helpers_6, utils_10) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function Delete(uri, ...middlewares) {
            return function (target, propertyKey, descriptor) {
                const method = descriptor.value;
                const instance = target;
                descriptor.value = function () {
                    return method.apply(target, arguments);
                };
                setTimeout(() => {
                    uri = utils_10.AppUtils.joinPath(target.routeUri, '/', uri);
                    instance.delete(uri, helpers_6.ErrorHandling.wrapRoute(...middlewares, function () {
                        return target[propertyKey](...arguments);
                    }));
                }, 0);
            };
        }
        exports.Delete = Delete;
    });
    define("lib/methods/patch.decorator", ["require", "exports", "app/core/helpers/index", "app/core/utils/index"], function (require, exports, helpers_7, utils_11) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function Patch(uri, ...middlewares) {
            return function (target, propertyKey, descriptor) {
                const method = descriptor.value;
                descriptor.value = function () {
                    return method.apply(target, arguments);
                };
                setTimeout(() => {
                    uri = utils_11.AppUtils.joinPath(target.routesPath, '/', uri);
                    target.patch(uri, helpers_7.ErrorHandling.wrapRoute(...middlewares, function () {
                        return target[propertyKey](...arguments);
                    }));
                }, 0);
            };
        }
        exports.Patch = Patch;
    });
    define("lib/methods/router.decorator", ["require", "exports", "express", "lib/typing/index", "app/core/utils/index", "app/core/helpers/index", "lib/core/index"], function (require, exports, express_1, typing_1, utils_12, helpers_8, core_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_12.Logger('Router Decorator');
        function Router(uri, options = {}) {
            return function (constructor) {
                uri = utils_12.AppUtils.joinPath(uri);
                const { prototype } = constructor;
                const router = express_1.Router(options);
                const routerPrototype = utils_12.AppUtils.getPrototypeOf(router);
                for (const i in routerPrototype) {
                    prototype[i] = routerPrototype[i].bind(router);
                }
                if (options.middleware && options.middleware.length) {
                    router.use(`${uri}`, helpers_8.ErrorHandling.wrapRoute(...options.middleware));
                }
                utils_12.AppUtils.defineProperty(prototype, typing_1.RouterProperties.RoutesPath, { get() { return uri; } });
                const id = utils_12.AppUtils.generateHash();
                utils_12.AppUtils.defineProperty(prototype, typing_1.RouterProperties.ID, { get() { return id; } });
                core_1.Wrapper.registerRouter(constructor);
                return class extends constructor {
                    constructor(...args) {
                        super(...args);
                        return router;
                    }
                };
            };
        }
        exports.Router = Router;
    });
    define("lib/methods/interceptor.decorator", ["require", "exports", "app/core/helpers/index"], function (require, exports, helpers_9) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function Intercept() {
            return function (target, propertyKey, descriptor) {
                const method = descriptor.value;
                descriptor.value = function () {
                    return method.apply(target, arguments);
                };
                setTimeout(() => {
                    target.use(helpers_9.ErrorHandling.wrapRoute(function () {
                        console.log('Test interceptor');
                        return target[propertyKey](...arguments);
                    }));
                }, 0);
            };
        }
        exports.Intercept = Intercept;
    });
    define("lib/methods/index", ["require", "exports", "tslib", "lib/methods/get.decorator", "lib/methods/post.decorator", "lib/methods/put.decorator", "lib/methods/delete.decorator", "lib/methods/patch.decorator", "lib/methods/router.decorator", "lib/methods/interceptor.decorator"], function (require, exports, tslib_7, get_decorator_1, post_decorator_1, put_decorator_1, delete_decorator_1, patch_decorator_1, router_decorator_1, interceptor_decorator_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_7.__exportStar(get_decorator_1, exports);
        tslib_7.__exportStar(post_decorator_1, exports);
        tslib_7.__exportStar(put_decorator_1, exports);
        tslib_7.__exportStar(delete_decorator_1, exports);
        tslib_7.__exportStar(patch_decorator_1, exports);
        tslib_7.__exportStar(router_decorator_1, exports);
        tslib_7.__exportStar(interceptor_decorator_1, exports);
    });
    define("lib/core/wrapper", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Wrapper {
            static registerRouter(router, subRouter) {
                if (!!subRouter) {
                    this.wrapRouter(subRouter);
                    this.assignRouterTo(subRouter, router);
                }
                else {
                    this.wrapRouter(router);
                }
            }
            static wrapRouter(Router) {
                try {
                    const router = new Router;
                    if (!router.id) {
                        new Error('please consider add @Router to the top of class');
                    }
                    this.list.push(router);
                }
                catch (error) {
                    new Error('The provided router is not constructor');
                }
            }
            static assignRouterTo(subRouter, superRouter) {
                const parentRouter = this.getRouter(superRouter);
                if (!parentRouter) {
                    throw new Error('Please register the parent router first, then try');
                }
                parentRouter.use(superRouter.routesPath, subRouter.router);
            }
            static get routerList() {
                return this.list;
            }
            static getRouter({ id }) {
                const { router } = this.list.find(({ router }) => router.id === id);
                return router;
            }
            static dispatchRouter({ router }) {
                this.list.splice(router);
            }
        }
        Wrapper.list = [];
        exports.Wrapper = Wrapper;
    });
    define("lib/core/index", ["require", "exports", "tslib", "lib/methods/index", "lib/core/wrapper"], function (require, exports, tslib_8, methods_1, wrapper_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_8.__exportStar(methods_1, exports);
        tslib_8.__exportStar(wrapper_1, exports);
    });
    define("app/app", ["require", "exports", "tslib", "express", "morgan", "compression", "helmet", "path", "app/core/utils/index", "environment/env", "lib/core/index", "app/core/helpers/index"], function (require, exports, tslib_9, express, morgan, compression, helmet, path_2, utils_13, env_1, core_2, helpers_10) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        path_2 = tslib_9.__importDefault(path_2);
        const log = new utils_13.Logger('Application instance');
        class Application {
            constructor() {
                this.app = express();
                env_1.envirnoment.load();
                this.configure();
                this.allowCors();
            }
            get application() {
                return this.app;
            }
            allowCors() {
                this.app.use((req, res, next) => {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
                    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
                    next();
                });
            }
            configure() {
                this.app
                    .use(express.json())
                    .use(express.urlencoded({ extended: true }))
                    .use((morgan('dev')))
                    .use(helmet())
                    .use(compression());
                this.set('host', env_1.envirnoment.get('HOST') || 'localhost');
                this.set('port', env_1.envirnoment.get('PORT') || 8080);
            }
            populateRoutes() {
                this.application.use('/api', ...core_2.Wrapper.routerList, (req, res) => res.status(200).json({ work: '/API hitted' }));
                this.application.use('/', (req, res) => {
                    res.sendFile(path_2.default.join(process.cwd(), 'public', 'index.html'));
                });
                this.application.use(helpers_10.ErrorHandling.favIcon);
                this.application.use(helpers_10.ErrorHandling.catchError);
                this.application.use(helpers_10.ErrorHandling.notFound);
            }
            get(key) {
                return this.app.get(key);
            }
            set(key, value) {
                this.app.set(key, value);
                return value;
            }
        }
        exports.Application = Application;
    });
    define("app/core/app.service", ["require", "exports", "app/core/config/reactor"], function (require, exports, reactor_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class AppService {
            constructor() {
                this._reactor = new reactor_2.Reactor('build');
            }
            broadcast(value) {
                this._reactor.emit(value);
            }
            reactor() {
                return this._reactor;
            }
        }
        exports.appService = new AppService();
    });
    define("app/core/index", ["require", "exports", "tslib", "app/core/app.service"], function (require, exports, tslib_10, app_service_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        tslib_10.__exportStar(app_service_1, exports);
    });
    define("app/core/database/database", ["require", "exports", "mongoose", "app/core/utils/index"], function (require, exports, mongoose, utils_14) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new utils_14.Logger('Database');
        class Database {
            constructor() { }
            static load() {
                const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
                return mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-hp3qr.mongodb.net/${MONGO_PATH}`, {
                    useNewUrlParser: true,
                    autoIndex: false
                })
                    .then(() => log.info('Database Connected'))
                    .catch((error) => log.error("Database Not Connected", error));
            }
        }
        exports.Database = Database;
    });
    define("app/server", ["require", "exports", "tslib", "app/app", "lib/localization/index", "app/core/helpers/index", "app/core/index", "app/core/utils/logger.service", "url", "app/core/database/database", "ws", "http", "app/core/utils/index"], function (require, exports, tslib_11, app_1, localization_3, helpers_11, core_3, logger_service_2, url_3, database_1, ws_1, http, utils_15) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        ws_1 = tslib_11.__importDefault(ws_1);
        const log = new logger_service_2.Logger('Server init');
        class Server extends app_1.Application {
            constructor(port) {
                super();
                this.port = +this.get('port');
                this.host = this.get('host');
                this.path = null;
                port && (this.port = port);
                this.path = new url_3.URL(`http://${this.host}:${this.port}`);
                try {
                    this.init();
                }
                catch (error) {
                    // throw new Error('Faild to init the server');
                }
            }
            static bootstrap(port) {
                log.debug('Start boostrapping server');
                return new Server(port);
            }
            populateServer() {
                return Promise.resolve(this.startServer(this.createServer()));
            }
            createServer() {
                return http.createServer(this.application);
            }
            startServer(server) {
                return server.listen(this.path.port, +this.path.hostname, () => {
                    log.info(`${new Date()} Server running at ${this.path.href}`);
                });
            }
            setupLocalization() {
                localization_3.localization.use('en');
            }
            init() {
                this.populateServer()
                    .then(server => {
                    const clients = [];
                    const wss = new ws_1.default.Server({ server });
                    wss.on('connection', (ws, req) => {
                        ws.send(JSON.stringify(utils_15.AppUtils.generateHash()));
                        ws.on('error', (e) => {
                            console.log('error', e);
                        });
                        ws.on('close', (e) => {
                            console.log('close', e);
                        });
                        ws.on('message', (message) => {
                            console.log('received: %s', message);
                            clients.push({
                                ws,
                                Role: message.Role,
                                name: message.name,
                                id: req.headers['Sec-WebSocket-Accept'],
                            });
                            if (message.Role === 'controller') {
                                const outgoingMessage = clients.filter(client => client.Role !== 'controller').map(el => ({ id: el.id }));
                                ws.send(JSON.stringify(outgoingMessage));
                            }
                        });
                    });
                });
                database_1.Database.load();
                this.populateRoutes();
                this.setupLocalization();
                core_3.appService.broadcast(null);
            }
        }
        Server.LEVEL = helpers_11.ServerLevel.DEV;
        exports.Server = Server;
    });
    define("main", ["require", "exports", "app/core/utils/logger.service", "app/server"], function (require, exports, logger_service_3, server_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const log = new logger_service_3.Logger('Main begin');
        const server = server_2.Server.bootstrap(null);
        process.chdir('./src/');
    });
    
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();