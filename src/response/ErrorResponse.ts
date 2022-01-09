import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { HttpResponse } from './HttpResponse';

export class ErrorResponse extends HttpResponse {
    constructor(
        public message: string,
        statusCode = StatusCodes.BAD_REQUEST,
        public code?: string,
    ) {
        super(statusCode);
    }

    static BadRequest(message: string, code: string) {
        return new ErrorResponse(message, StatusCodes.BAD_REQUEST, code);
    }

    static Unauthorized() {
        return new ErrorResponse(getReasonPhrase(StatusCodes.UNAUTHORIZED), StatusCodes.UNAUTHORIZED, 'unauthorized');
    }

    static Forbidden() {
        return new ErrorResponse('You are not allowed to access this resource', StatusCodes.FORBIDDEN, 'forbidden');
    }

    static MethodNotAllowed() {
        return new ErrorResponse(getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED), StatusCodes.METHOD_NOT_ALLOWED, 'method_not_allowed');
    }

    toJson(): object {
        return {
            'message': this.message,
            'code': this.code ?? undefined
        }
    }

}
