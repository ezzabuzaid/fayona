import { ErrorResponse } from '@core/helpers';
import { Logger, AppUtils } from '@core/utils';
import { translate } from '@lib/translation';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { NetworkStatus } from './network-status';
import { sendResponse, Responses } from './response.model';
import { stage } from './stages';

const log = new Logger('Errors');

export enum Errors {
    CastError = 'CastError',
    AssertionError = 'AssertionError',
    MongoError = 'MongoError',
    ErrorResponse = 'ErrorResponse',
    SuccessResponse = 'SuccessResponse',
    JsonWebTokenError = 'JsonWebTokenError',
    TokenExpiredError = 'TokenExpiredError',
    NotBeforeError = 'NotBeforeError',
    ValidationError = 'ValidationError',
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

    public static catchError(error: any, req: Request, res: Response, next: NextFunction): ErrorRequestHandler {
        const response = new ErrorResponse(error.message,
            isNaN(error.code)
                ? NetworkStatus.INTERNAL_SERVER_ERROR
                : error.code
        );

        switch (error.name) {
            case Errors.CastError:
                response.message = translate('invalid_syntax');
                response.code = NetworkStatus.BAD_REQUEST;
                break;
            case Errors.ValidationError:
                // Mongoose validation error
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
            default:
                console.log(error);
        }
        sendResponse(res, response);
        return;
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

    public static wrapRoutes(...func) {
        return func.map((fn) => (...args) => fn(...args).catch(args[2]));
    }

    public static throwExceptionIfDeviceUUIDIsMissing(device_uuid: string) {
        if (AppUtils.isFalsy(device_uuid)) {
            throw new Responses.Unauthorized();
        }
    }

}

// see also https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
