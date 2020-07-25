export * from './error.response';
export * from './result';
export * from './success.response';
export * from './generic.response';


import { NetworkStatus } from '@core/helpers';
import { ErrorResponse } from './error.response';
import { SuccessResponse } from './success.response';

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