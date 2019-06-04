import { ErrorResponse } from '@core/helpers';
import { Logger } from '@core/utils';
import { translate } from '@lib/translation';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { NetworkStatus } from './network-status';

const log = new Logger('Errors');

export enum Errors {
    CastError = 'CastError',
    AssertionError = 'AssertionError',
    MongoError = 'MongoError',
    ErrorResponse = 'ErrorResponse',
    SuccessResponse = 'SuccessResponse',
    JsonWebTokenError = 'JsonWebTokenError',
    ValidationError = 'ValidationError'
}

export class ErrorHandling {
    public static catchError(error: any, req: Request, res: Response, next: NextFunction): ErrorRequestHandler {
        const response = new ErrorResponse(error.message, isNaN(error.code) ? NetworkStatus.INTERNAL_SERVER_ERROR : error.code);
        switch (error.name) {
            case Errors.CastError:
                // FIXME  error accoured when try to use with id mongoose method and the id is undefined usually when you get the id from the req.params.id
                // message = 'some usefulEntityNotFound message';
                response.message = translate('invalid_syntax');
                response.code = NetworkStatus.BAD_REQUEST;
                break;
            case Errors.ValidationError:
                // Mongoose validation error
                response.code = NetworkStatus.BAD_REQUEST;
                break;
        }
        // production(() => {
        //     response.message = translate('internal_server_error');
        // });

        res.status(response.code).json(response);
        return;
    }

    public static throwError(message, code = NetworkStatus.INTERNAL_SERVER_ERROR) {
        throw new ErrorResponse(message, code);
    }

    public static notFound(req: Request, res: Response, next: NextFunction) {
        const error = new ErrorResponse(`${req.originalUrl} => ${translate('endpoint_not_found')}`, NetworkStatus.NOT_FOUND);
        return res.status(error.code).json(error);
    }

    public static favIcon(req: Request, res: Response, next: NextFunction) {
        if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
            return res.sendStatus(204);
        }
        return next();
    }

    public static wrapRoute(...func) {
        return func.map((fn) => (...args) => fn(...args).catch(args[2]));
    }

}

// see also https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
