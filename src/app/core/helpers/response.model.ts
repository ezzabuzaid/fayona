import { NetworkStatus } from '@core/helpers/network-status';
import { translate } from '@lib/translation';
import { Response } from 'express';

export abstract class HttpResponse extends Error {
    public status: string;
    public code: number;
}

export class SuccessResponse<T> extends HttpResponse {
    [x: string]: any;
    public name = SuccessResponse.name;
    constructor(public data: T, message = 'success', code = NetworkStatus.OK, status?: string) {
        super();
        this.message = typeof message === 'string' ? translate(message) : message;
        this.code = code;
        this.status = status || NetworkStatus.getStatusText(code);
    }

}

export class ErrorResponse extends HttpResponse {
    public name = ErrorResponse.name;
    public error: string;
    constructor(message: string, code = NetworkStatus.BAD_REQUEST, status?: string) {
        super();
        this.message = typeof message === 'string' ? translate(message) : message;
        this.code = code;
        this.status = status || NetworkStatus.getStatusText(code);
    }

}
export namespace Responses {
    export class Unauthorized extends ErrorResponse {
        constructor(message: string = 'not_authorized') {
            super(message, NetworkStatus.UNAUTHORIZED);
        }
    }
    export class BadRequest extends ErrorResponse {
        constructor(message: string = 'bad_request') {
            super(message, NetworkStatus.BAD_REQUEST);
        }
    }
    export class Ok<T> extends SuccessResponse<T> {
        constructor(data: T) {
            super(data);
        }
    }
    export class Created<T> extends SuccessResponse<T> {
        constructor(data: T) {
            super(data, 'created', NetworkStatus.CREATED);
        }
    }

}
export function sendResponse(res: Response, httpResponse: HttpResponse) {
    return res.status(httpResponse.code).json(httpResponse);
}
