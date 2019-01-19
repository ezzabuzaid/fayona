import * as HttpStatusCodes from 'http-status-codes';

abstract class Response extends Error {
    status: string;
    code: number;
}

export class SuccessResponse<T> extends Response {
    data: T;
    constructor(data: T, message: string, code: number, status?: string) {
        super();
        this.message = message;
        this.code = code;
        this.data = data;
        this.status = status || HttpStatusCodes.getStatusText(code);
    }

}

export class ErrorResponse extends Response {
    error: string;
    constructor(message: string, code: number, status?: string) {
        super();
        this.message = message;
        this.code = code;
        this.status = status || HttpStatusCodes.getStatusText(code);
    }

}
