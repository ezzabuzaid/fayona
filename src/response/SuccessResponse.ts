import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { HttpResponse } from './HttpResponse';

export class SuccessResponse<T> extends HttpResponse {
    [x: string]: any;

    constructor(
        public data: T,
        public code: StatusCodes,
        message?: string,
    ) {
        super(code);
        this.message = message ?? getReasonPhrase(code);
    }

    static Deleted(result = null) {
        return new SuccessResponse(result, StatusCodes.OK, "Deleted",);
    }

    static Created(result = null) {
        return new SuccessResponse(result, StatusCodes.CREATED, "Created",);
    }

    static Updated(result = null) {
        return new SuccessResponse(result, StatusCodes.OK, "Updated",);
    }

    static Ok(result = null) {
        return new SuccessResponse(result, StatusCodes.OK, "Success",);
    }

    static NoContent() {
        const response = new SuccessResponse(undefined, StatusCodes.NO_CONTENT, "Success");
        delete response.status;
        return response;
    }

    toJson(): object {
        return {
            'message': this.message,
            'code': this.code,
            'data': this.data
        }
    }

}
