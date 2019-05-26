import express = require('express');
import morgan = require('morgan');
import compression = require('compression');
import helmet = require('helmet');
import Sentry = require('@sentry/node')
import path from 'path';
import { Logger } from '@core/utils';
import { Wrapper } from '@core/wrapper';
import { ErrorHandling, production, stage } from '@core/helpers';
const log = new Logger('Application instance');

// Stage.tests(StageLevel.DEV, () => {
//     Sentry.init({ dsn: 'https://57572231908b4ef0bde6a7328e71cfcf@sentry.io/1462257' });
// });

export class Application {
    private _application = express();
    private staticDirectory = path.join(process.cwd(), 'src', 'public');
    private uploadDirectory = path.join(process.cwd(), 'uploads');
    constructor() {
        this.configure();
        this.allowCors();
    }

    get application() {
        return this._application;
    }

    /**
     ** allow cross origin restriction
     *? see the difference in cors package
     */
    private allowCors() {
        this.application.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    /**
     ** configure the app instance
     ** set app variables 
     */
    private configure() {
        this.application
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(morgan('dev'))
            .use(helmet())
            .use(compression())
            .use(express.static(this.staticDirectory))
            .use(express.static(this.uploadDirectory));

        production(() => {
            this.application
                .use(Sentry.Handlers.requestHandler())
                .use(Sentry.Handlers.errorHandler())
        });
    }

    protected populateRoutes() {
        return new Promise((resolve) => {
            // SECTION routes resolving event
            Wrapper.routerList.forEach(({ router, uri }) => {
                this.application.use(path.join('/api', uri), router);
            });
            this.application.get('/api', (req, res) => res.status(200).json({ work: '/API hitted' }));
            this.application.get('/', (req, res) => res.sendFile('index.html'));

            // * catch favIcon request
            this.application.use(ErrorHandling.favIcon);

            // * catch not found error
            this.application.use(ErrorHandling.notFound);

            // * Globally catch error
            this.application.use(ErrorHandling.catchError);
            resolve(this.application);
        });
    }

    get(key: string): string {
        return this.application.get(key);
    }

    set<T>(key: string, value: T): T {
        this.application.set(key, value);
        return value;
    }
}

// TODO add lusca lib

