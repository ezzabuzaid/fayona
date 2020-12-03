import { HttpResponse } from './generic_response';
import { StatusCodes } from 'http-status-codes';

export class SuccessResponse<T> extends HttpResponse {
    [x: string]: any;
    constructor(public data: T, public message = 'success', code = StatusCodes.OK) {
        super(code);
    }

    static Deleted() {
        return new SuccessResponse(null, "Deleted");
    }

    static Created(data?) {
        return new SuccessResponse(data, "Created", StatusCodes.CREATED);
    }

    static Updated(data?) {
        return new SuccessResponse(data, "Updated", StatusCodes.OK);
    }

    static Ok(data?) {
        return new SuccessResponse(data, "Success", StatusCodes.OK);
    }

}
