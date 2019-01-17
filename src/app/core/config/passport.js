"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var passport = require("passport");
var passport_local_1 = require("passport-local");
var users_model_1 = require("../../api/users/users.model");
var LocalStrategy = /** @class */ (function (_super) {
    __extends(LocalStrategy, _super);
    function LocalStrategy() {
        var _this = _super.call(this, function (username, password, done) { return _this.use(username, password, done); }) || this;
        return _this;
    }
    LocalStrategy.prototype.use = function (username, password, done) {
        users_model_1.UsersModel.findOne({ username: username })
            .then(function (user) {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.comparePassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })["catch"](function (error) {
            return done(error);
        });
    };
    return LocalStrategy;
}(passport_local_1.Strategy));
exports.LocalStrategy = LocalStrategy;
var Passport = /** @class */ (function (_super) {
    __extends(Passport, _super);
    function Passport(app) {
        var _this = _super.call(this) || this;
        app.use(passport.initialize());
        _this.use(new LocalStrategy());
        return _this;
    }
    return Passport;
}(passport.Passport));
exports.Passport = Passport;
// not used
