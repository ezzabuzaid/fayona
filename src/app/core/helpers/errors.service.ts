import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ErrorResponse } from '@core/helpers';
import HttpStatusCodes = require('http-status-codes');

export class ErrorHandling {
    static catchError(error: ErrorResponse, req: Request, res: Response, next: NextFunction): ErrorRequestHandler {
        res.status(error.code).json(error);
        return
    }

    static throwError(message = '', code = HttpStatusCodes.INTERNAL_SERVER_ERROR): ErrorResponse {
        throw new ErrorResponse(message, code);
    }

    static notFound(req: Request, res: Response, next: NextFunction) {
        const error = new ErrorResponse('endpoint not found', HttpStatusCodes.NOT_FOUND);
        res.status(error.code).json(error);
    }

    static wrapRoute(fn) {
        return (...args) => fn(...args).catch(args[2])
    }
    
}
