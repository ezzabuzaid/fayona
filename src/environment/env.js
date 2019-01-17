"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
var logger_service_1 = require("../app/core/utils/logger.service");
var log = new logger_service_1.Logger('Application instance');
var Envirnoment = /** @class */ (function () {
    function Envirnoment() {
    }
    Envirnoment.load = function (state) {
        if (state === void 0) { state = ''; }
        var _a = dotenv_1.config({ path: "./src/environment/.env" + state }), error = _a.error, parsed = _a.parsed;
        if (error) {
            new Error('an error accourd while loading the env file');
        }
        log.info('Envirnoment file loaded');
        return parsed;
    };
    return Envirnoment;
}());
exports.environment = Envirnoment;
