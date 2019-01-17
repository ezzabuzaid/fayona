"use strict";
exports.__esModule = true;
var utils_1 = require("../../app/core/utils");
function Get(routerPath) {
    return function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            //* any code here will be executed when the marked method get called 
            //* bind a router class instance
            return method.apply(target.instance, arguments);
        };
        //* since the method decorator called before the class decorator we have no access to any of
        //* the method or properites that binded manually by the {Router} decorator
        //* and setTimeout solved this to us  
        setTimeout(function () {
            //* a way fix path to router slashes
            //* join router path and get path
            routerPath = utils_1.AppUtils.joinPath(target.routesPath, '/', routerPath);
            //* assign the router
            target.get(routerPath, function () {
                target[propertyKey].apply(target, arguments);
            });
        }, 0);
    };
}
exports.Get = Get;
