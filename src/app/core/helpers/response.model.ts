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
        this.message = translate(message);
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

export class UnauthorizedResponse extends ErrorResponse {
    constructor() {
        super('not_authorized', NetworkStatus.UNAUTHORIZED);
    }
}

export function sendResponse(res: Response, response: HttpResponse) {
    return res.status(response.code).json(response);
}
