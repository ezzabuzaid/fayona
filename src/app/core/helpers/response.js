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
var HttpStatusCodes = require("http-status-codes");
var Response = /** @class */ (function () {
    function Response() {
    }
    return Response;
}());
var SuccessResponse = /** @class */ (function (_super) {
    __extends(SuccessResponse, _super);
    function SuccessResponse(data, message, code, status) {
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.code = code;
        _this.data = data;
        _this.status = status || HttpStatusCodes.getStatusText(code);
        return _this;
    }
    return SuccessResponse;
}(Response));
exports.SuccessResponse = SuccessResponse;
var ErrorResponse = /** @class */ (function (_super) {
    __extends(ErrorResponse, _super);
    function ErrorResponse(message, code, status) {
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.code = code;
        _this.status = status || HttpStatusCodes.getStatusText(code);
        return _this;
    }
    return ErrorResponse;
}(Response));
exports.ErrorResponse = ErrorResponse;
