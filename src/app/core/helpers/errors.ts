import { ErrorResponse } from '@core/helpers';
import { Logger, AppUtils } from '@core/utils';
import { translate } from '@lib/translation';
import { NextFunction, Request, Response } from 'express';
import { NetworkStatus } from './network-status';
import { Responses } from './response';
import { ApplicationConstants } from '@core/constants';
import stage from './stage';

const log = new Logger('Errors');

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

export class ErrorHandling {

    constructor() {
        // TODO Handle applications errors and implement them with refactor event class
        const errorTypes = ['unhandledRejection', 'uncaughtException', 'rejectionHandled'];
        const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

        errorTypes.map((type: any) => {
            process.on(type, async () => {
                try {
                    log.info(`process.on ${type}`);
                    process.exit(0);
                } catch (_) {
                    process.exit(1);
                }
            });
        });

        signalTraps.map((type: any) => {
            process.once(type, async () => {
                try {
                    log.info(`process.on ${type}`);
                } finally {
                    process.kill(process.pid, type);
                }
            });
        });
    }

    public static catchError(error: any, req: Request, res: Response, next: NextFunction) {
        const response = new ErrorResponse(error.message,
            isNaN(error.code)
                ? NetworkStatus.INTERNAL_SERVER_ERROR
                : error.code
        );

        switch (error.name) {
            case Errors.AssertionError:
            case Errors.ERR_AMBIGUOUS_ARGUMENT:
                response.code = stage.production ? NetworkStatus.BAD_REQUEST : response.code;
            case Errors.StrictModeError:
                response.message = translate('over_posting_is_not_allowed');
                response.code = NetworkStatus.BAD_REQUEST;
                break;
            case Errors.CastError:
                response.message = translate('invalid_syntax');
                response.code = NetworkStatus.BAD_REQUEST;
                break;
            case Errors.ValidationError:
                // Mongoose validation error
                response.code = NetworkStatus.BAD_REQUEST;
                break;
            case ApplicationConstants.PAYLOAD_VALIDATION_ERRORS:
                // class validator validation error
                response.code = NetworkStatus.BAD_REQUEST;
                break;
            case Errors.TokenExpiredError:
                response.message = translate('jwt_expired');
                response.code = NetworkStatus.UNAUTHORIZED;
                break;
            case Errors.JsonWebTokenError:
                response.message = translate(stage.production ? 'jwt_expired' : error.message);
                response.code = NetworkStatus.UNAUTHORIZED;
                break;
            case Errors.MulterError:
                response.code = NetworkStatus.BAD_REQUEST;
                break;
            case Errors.PayloadTooLargeError:
                response.code = NetworkStatus.BAD_REQUEST;
                response.message = 'request entity too large';
                break;
            default:

        }
        console.log(error);
        res.status(response.code).json(response);
    }

    public static notFound(req: Request, res: Response, next: NextFunction) {
        const error = new ErrorResponse(
            `${req.originalUrl} => ${translate('endpoint_not_found')}`, NetworkStatus.NOT_FOUND
        );
        return res.status(error.code).json(error);
    }

    public static favIcon(req: Request, res: Response, next: NextFunction) {
        if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
            return res.sendStatus(204);
        }
        next();
        return;
    }

    public static throwExceptionIfDeviceUUIDIsMissing(device_uuid: string) {
        if (AppUtils.isFalsy(device_uuid)) {
            throw new Responses.Unauthorized();
        }
    }

}

// see also https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
