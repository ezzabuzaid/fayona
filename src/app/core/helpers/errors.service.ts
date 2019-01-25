import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ErrorResponse } from '@core/helpers';
import { CastError, Error } from 'mongoose';
import { AssertionError } from 'assert';
import { MongoError } from 'mongodb';
import HttpStatusCodes = require('http-status-codes');
import { production } from './helpers.service';
import { translate } from '@lib/localization';


enum Errors {
    CastError = 'CastError',
    AssertionError = 'AssertionError',
    MongoError = 'MongoError'
}

export class ErrorHandling {
    static catchError(error: any, req: Request, res: Response, next: NextFunction): ErrorRequestHandler {
        const response = new ErrorResponse(error.message);
        switch (error.name) {
            case Errors.CastError:
            // FIXME  error accoured when try to use with id mongoose method and the id is undefined usually when you get the id from the req.params.id
            // message = 'some usefull message';
            response.message = translate('invalid_syntax');
            response.code = HttpStatusCodes.BAD_REQUEST;
        }
        
        production(() => {
            response.message = translate('internal_server_error');
        });

        res.status(response.code).json(response);
        return;
    }

    static throwError(message, code = HttpStatusCodes.INTERNAL_SERVER_ERROR): ErrorResponse {
        throw new ErrorResponse(message);
    }

    static notFound(req: Request, res: Response, next: NextFunction) {
        const error = new ErrorResponse('endpoint not found', HttpStatusCodes.NOT_FOUND);
        res.status(error.code).json(error);
    }

    static wrapRoute(fn) {
        return (...args) => {
            return fn(...args)
                .catch(args[2]);
        }
    }

}


// see also https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
