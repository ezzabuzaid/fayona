import { HttpResponse } from './generic_response';
import {
    getReasonPhrase,
    StatusCodes,
} from 'http-status-codes';
export class ErrorResponse extends HttpResponse {
    constructor(public message: string, code = StatusCodes.BAD_REQUEST) {
        super(code);
    }


    static BadRequest(message) {
        return new ErrorResponse(message, StatusCodes.BAD_REQUEST);
    }

    static Unauthorized() {
        return new ErrorResponse(getReasonPhrase(StatusCodes.UNAUTHORIZED), StatusCodes.UNAUTHORIZED);
    }
    static Forbidden() {
        return new ErrorResponse('You are not allowed to access this resource', StatusCodes.FORBIDDEN);
    }

}
