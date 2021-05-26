import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { HttpResponse } from './generic_response';

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

    toJson(): object {
        return {
            'message': this.message,
            'code': this.code ?? undefined
        }
    }

}
