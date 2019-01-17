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
var express_1 = require("express");
var utils_1 = require("../../app/core/utils");
function Router(routerPath, options) {
    if (options === void 0) { options = {}; }
    return function (constructor) {
        //* a way fix path to router slashes
        routerPath = utils_1.AppUtils.joinPath(routerPath);
        var prototype = constructor.prototype;
        var router = express_1.Router(options);
        //* extend router        
        var routerPrototype = utils_1.AppUtils.getPrototypeOf(router);
        for (var i in routerPrototype) {
            prototype[i] = routerPrototype[i].bind(router);
        }
        //* define getter for router instance
        //* this will be used in other decorators 
        // AppUtils.defineProperty(prototype, 'router', { get() { return router }, })
        //* the controller router | base path for router class
        //* all routes will be under this path
        utils_1.AppUtils.defineProperty(prototype, 'routesPath', { get: function () { return routerPath; } });
        //* mark a class with id
        var id = utils_1.AppUtils.generateHash();
        utils_1.AppUtils.defineProperty(prototype, 'id', { get: function () { return id; } });
        //* construct the Router class
        //! #issue {one}, the developer must have the ability to construct their own objects
        // const routerClassinstance = new constructor;
        // AppUtils.defineProperty(prototype, 'instance', { get() { return routerClassinstance }, })
        //* Check if intercept listener defined
        //! If you try to inject the method it runtime
        //! this check will be passed, so it will be like any regular method 
        // const { instance } = routerClassinstance;
        // const { intercept } = instance;
        // if (!!intercept) {
        //     //? fine a way to bind intercept method without init an instance of Router class 
        //     router.all(`${routerPath}*`, ...(options.middleware || []), intercept.bind(instance));
        // }
        // //* retrun the created instance mean it will not be able to create another one
        // ! #issue {two} because of the #issue {one} we return the instance and the result will be as discused there
        // return instance;
        // constructor.prototype = ;
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, args) || this;
                return router;
            }
            return class_1;
        }(constructor));
    };
}
exports.Router = Router;
