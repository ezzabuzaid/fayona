import en from '@assets/languages/en.json';
import { ErrorHandling, stage, StageLevel } from '@core/helpers';
import { Logger } from '@core/utils';
import { translation } from '@lib/translation';
import Sentry = require('@sentry/node');
import compression = require('compression');
import express = require('express');
import helmet = require('helmet');
import morgan = require('morgan');
import { Wrapper } from './wrapper';

// import monitor = require('express-status-monitor');
// https://github.com/RafalWilinski/express-status-monitor
import path from 'path';
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
        this.setupLocalization();
    }

    get application() {
        return this._application;
    }

    /**
     * allow cross origin restriction
     * see the difference in cors package
     */
    private allowCors() {
        this.application.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    /**
     * configure the app instance
     * set app variables
     */
    private configure() {
        stage.test(StageLevel.PROD, () => {
            this.application
                .use(Sentry.Handlers.requestHandler())
                .use(Sentry.Handlers.errorHandler());
        });

        this.application
            // .use(monitor())
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(morgan('dev'))
            .use(helmet())
            .use(compression())
            .use(express.static(this.staticDirectory))
            .use(express.static(this.uploadDirectory));

        // TODO setup html view engine for angular

        // TODO Security
        // 1_ sql injection
        // 2_ csrf
        // 3_ xss
    }

    protected populateRoutes() {
        return new Promise((resolve) => {
            // SECTION routes resolving event
            this.application.use((req, res, next) => {
                const acceptLanguage = req.acceptsLanguages();
                // log.warn(acceptLanguage);
                if (acceptLanguage) {
                    // TODO use localization here
                }
                next();
            });

            Wrapper.routerList.forEach(({ router, uri }) => {
                this.application.use(path.join('/api', uri), router);
            });

            this.application.get('/email', (req, res) => res.sendFile('email/index.html'));
            this.application.get('/api', (req, res) => res.status(200).json({ work: '/API hitted' }));
            this.application.get('/', (req, res) => res.sendFile('index.html'));
            this.application.use(ErrorHandling.favIcon);
            this.application.use(ErrorHandling.notFound);
            this.application.use(ErrorHandling.catchError);
            resolve(this.application);
        });
    }

    private setupLocalization() {
        translation.add('en', en);
        // localization.add('ar', ar);
        translation.use('en');
    }

    public get<T>(key: string): T {
        return this.application.get(key);
    }

    public set(key: string, value: any) {
        this.application.set(key, value);
    }
}

// TODO add lusca lib
