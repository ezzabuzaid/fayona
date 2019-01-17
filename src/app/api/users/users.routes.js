"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("../../../lib/core");
var methods_1 = require("../../../lib/methods");
var users_model_1 = require("./users.model");
var response_1 = require("../../core/helpers/response");
var HttpStatusCodes = require("http-status-codes");
var auth_1 = require("../auth/auth");
var utils_service_1 = require("../../core/utils/utils.service");
var logger_service_1 = require("../../core/utils/logger.service");
var log = new logger_service_1.Logger('User Router');
var UsersRouter = /** @class */ (function () {
    function UsersRouter() {
    }
    UsersRouter.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, currentUser, isPasswordEqual, responseData, response_2, response, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, username = _a.username, password = _a.password;
                        return [4 /*yield*/, users_model_1.UsersModel.getUser(username)];
                    case 1:
                        currentUser = _b.sent();
                        if (!!!currentUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, currentUser.comparePassword(password)];
                    case 2:
                        isPasswordEqual = _b.sent();
                        if (isPasswordEqual) {
                            responseData = utils_service_1.AppUtils.removeKey('password', currentUser.toObject());
                            responseData.token = auth_1["default"].generateToken({ id: currentUser.id });
                            response_2 = new response_1.SuccessResponse(responseData, 'Register successfully', HttpStatusCodes.OK);
                            res.status(response_2.code).json(response_2);
                            return [2 /*return*/, next()];
                        }
                        _b.label = 3;
                    case 3:
                        response = new response_1.ErrorResponse('Try to enter another username', HttpStatusCodes.CONFLICT);
                        return [2 /*return*/, res.status(response.code).json(response)];
                    case 4:
                        error_1 = _b.sent();
                        log.error('@Post Login error', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersRouter.prototype.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, currentUser, response_3, user, responseData, response, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, username = _a.username, password = _a.password;
                        return [4 /*yield*/, users_model_1.UsersModel.getUser(username)];
                    case 1:
                        currentUser = _b.sent();
                        log.debug(currentUser);
                        if (!!currentUser) {
                            response_3 = new response_1.ErrorResponse('Try to enter another username', HttpStatusCodes.BAD_REQUEST);
                            return [2 /*return*/, res.status(response_3.code).json(response_3)];
                        }
                        user = new users_model_1.UsersModel({ username: username, password: password });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        responseData = utils_service_1.AppUtils.removeKey('password', user.toObject());
                        response = new response_1.SuccessResponse(responseData, 'Register successfully', HttpStatusCodes.CREATED);
                        res.status(response.code).json(response);
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        log.error('@Post Register error', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        methods_1.Post('login')
    ], UsersRouter.prototype, "login");
    __decorate([
        methods_1.Post('register')
    ], UsersRouter.prototype, "register");
    UsersRouter = __decorate([
        core_1.Router('users')
    ], UsersRouter);
    return UsersRouter;
}());
exports.UsersRouter = UsersRouter;
