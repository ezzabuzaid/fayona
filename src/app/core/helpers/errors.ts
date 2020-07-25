import { ErrorResponse } from '@core/response';
import { Logger } from '@core/utils';
import { translate } from '@lib/translation';
import { NextFunction, Request, Response } from 'express';
import { NetworkStatus } from './network-status';

const log = new Logger('Errors');


export class ErrorHandling {

    constructor() {
        // TODO Handle applications errors and implement them with refactor event class
        const errorTypes = ['unhandledRejection', 'uncaughtException', 'rejectionHandled'];
        const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

        errorTypes.map((type: any) => {
            process.on(type, async () => {
                try {
                    log.info(`process.on ${ type }`);
                    process.exit(0);
                } catch (_) {
                    log.warn(`process killed because of ${ type }`);
                    process.exit(1);
                }
            });
        });

        signalTraps.map((type: any) => {
            process.once(type, async () => {
                try {
                    log.info(`process.on ${ type }`);
                } finally {
                    log.warn(`process killed because of ${ type }`);
                    process.kill(process.pid, type);
                }
            });
        });
    }


    public static notFound(req: Request, res: Response) {
        const error = new ErrorResponse(
            `${ req.originalUrl } => ${ translate('endpoint_not_found') }`, NetworkStatus.NOT_FOUND
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

}

// see also https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
