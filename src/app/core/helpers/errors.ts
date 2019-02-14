import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ErrorResponse } from '@core/helpers';
import { CastError, Error } from 'mongoose';
import { AssertionError } from 'assert';
import { MongoError } from 'mongodb';
import HttpStatusCodes = require('http-status-codes');
import { production } from './helpers.';
import { translate } from '@lib/localization';
import { Logger } from '@core/utils';

const log = new Logger('Errors');

export enum Errors {
    CastError = 'CastError',
    AssertionError = 'AssertionError',
    MongoError = 'MongoError',
    EntityNotFound = 'EntityNotFound'
}

export class ErrorHandling {
    static catchError(error: any, req: Request, res: Response, next: NextFunction): ErrorRequestHandler {
        const response = new ErrorResponse(error.message, error.code || HttpStatusCodes.INTERNAL_SERVER_ERROR);
        switch (error.name) {
            case Errors.CastError:
                // FIXME  error accoured when try to use with id mongoose method and the id is undefined usually when you get the id from the req.params.id
                // message = 'some usefulEntityNotFoundl message';
                response.message = translate('invalid_syntax');
                response.code = HttpStatusCodes.BAD_REQUEST;
                break;
        }

        // production(() => {
        //     response.message = translate('internal_server_error');
        // });

        res.status(response.code).json(response);
        return;
    }

    static throwError(message, code = HttpStatusCodes.INTERNAL_SERVER_ERROR): ErrorResponse {
        throw new ErrorResponse(message);
    }

    static notFound(req: Request, res: Response, next: NextFunction) {
        const error = new ErrorResponse(translate('endpoint_not_found'), HttpStatusCodes.NOT_FOUND);
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
