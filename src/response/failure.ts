import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "./ErrorResponse";

export class Failure extends ErrorResponse {
    constructor(
        public code: string,
        public message: string
    ) {
        super(message, StatusCodes.BAD_REQUEST, code);
    }
}
