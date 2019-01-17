"use strict";
exports.__esModule = true;
var server_1 = require("./app/server");
var logger_service_1 = require("./app/core/utils/logger.service");
var log = new logger_service_1.Logger('Main begain');
server_1.Server.bootstrap(null)
    .then(function () { return log.info('Bootstrab begain'); });
process.chdir('./src/');
