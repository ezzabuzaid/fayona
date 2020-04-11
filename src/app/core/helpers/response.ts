import { NetworkStatus } from '@core/helpers/network-status';
import { translate } from '@lib/translation';
import { AppUtils } from '@core/utils';

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
    export class Forbidden extends ErrorResponse {
        constructor(message: string = 'not_allowed') {
            super(message, NetworkStatus.FORBIDDEN);
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

export class Result<T> {
    public hasError = false;
    public data: T = null;
    public message: string = null;

    constructor(result: Partial<Result<T>> = new Result<T>({})) {
        this.data = result.data;
        this.message = result.message || null;
        this.hasError = result.hasError ?? AppUtils.isTruthy(result.message) ?? false;
    }
}