import { ErrorResponse } from '@core/response/error.response';
import { HttpResponse } from '@core/response/generic.response';
import { AppUtils } from '@core/utils';
import { translate } from '@lib/translation';
import { NextFunction, Request, Response } from 'express';
import { NetworkStatus } from './network-status';
import { PAYLOAD_VALIDATION_ERRORS } from '@lib/validation';
import { Result } from '@core/response';
import { envirnoment } from '@environment/env';

export function wrapRoutes(...middlewares) {
    return middlewares.map((middleware) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(middleware(req, res, next) as HttpResponse)
            .then((response) => {
                if (AppUtils.notNullOrUndefined(response)) {
                    if (response instanceof HttpResponse) {
                        return res.status(response.code).json(response);
                    } else {
                        return res.status(200).json(response);
                    }
                }
            })
            .catch((error) => {
                const response = catchError(error);
                res.status(response.code).json(response);
                return Promise.resolve();
            });
    });
}

export enum Errors {
    CastError = 'CastError',
    AssertionError = 'AssertionError',
    ERR_AMBIGUOUS_ARGUMENT = 'ERR_AMBIGUOUS_ARGUMENT',
    MongoError = 'MongoError',
    ErrorResponse = 'ErrorResponse',
    SuccessResponse = 'SuccessResponse',
    JsonWebTokenError = 'JsonWebTokenError',
    TokenExpiredError = 'TokenExpiredError',
    NotBeforeError = 'NotBeforeError',
    ValidationError = 'ValidationError',
    MulterError = 'MulterError',
    PayloadTooLargeError = 'PayloadTooLargeError:',
    StrictModeError = 'StrictModeError'
}
function catchError(error: any) {
    const response = new ErrorResponse(error.message,
        isNaN(error.code)
            ? NetworkStatus.INTERNAL_SERVER_ERROR
            : error.code
    );

    switch (error.name) {
        case Errors.AssertionError:
        case Errors.ERR_AMBIGUOUS_ARGUMENT:
            response.code = envirnoment.production ? NetworkStatus.BAD_REQUEST : response.code;
        case Errors.StrictModeError:
            response.message = translate('over_posting_is_not_allowed');
            response.code = NetworkStatus.BAD_REQUEST;
            break;
        case Errors.CastError:
            response.message = translate('invalid_syntax', { name: error.path });
            response.code = NetworkStatus.BAD_REQUEST;
            break;
        case Errors.ValidationError:
            // Mongoose validation error
            response.code = NetworkStatus.BAD_REQUEST;
            break;
        case PAYLOAD_VALIDATION_ERRORS:
            // class validator validation error
            response.code = NetworkStatus.BAD_REQUEST;
            break;
        case Errors.TokenExpiredError:
            response.message = translate('jwt_expired');
            response.code = NetworkStatus.UNAUTHORIZED;
            break;
        case Errors.JsonWebTokenError:
            response.message = translate(envirnoment.production ? 'jwt_expired' : error.message);
            response.code = NetworkStatus.UNAUTHORIZED;
            break;
        case Errors.MulterError:
            response.code = NetworkStatus.BAD_REQUEST;
            break;
        case Errors.PayloadTooLargeError:
            response.code = NetworkStatus.BAD_REQUEST;
            response.message = 'request entity too large';
            break;
        case Result.Error:
            response.code = NetworkStatus.BAD_REQUEST;
            break;
        default:
    }
    if (response.code === NetworkStatus.INTERNAL_SERVER_ERROR) {
        console.log(error);
    }
    return response;
}
