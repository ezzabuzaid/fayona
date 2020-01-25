import en from '@assets/languages/en.json';
import ar from '@assets/languages/ar.json';
import { ErrorHandling, stage, StageLevel } from '@core/helpers';
import { Logger } from '@core/utils';
import { translation } from '@lib/translation';
import compression = require('compression');
import express = require('express');
import helmet = require('helmet');
import morgan = require('morgan');
import { Wrapper } from './wrapper';
import path from 'path';
import cors from 'cors';

const log = new Logger('Application instance');

// import Sentry = require('@sentry/node');
// Stage.test(StageLevel.DEV, () => {
//     Sentry.init({ dsn: 'https://57572231908b4ef0bde6a7328e71cfcf@sentry.io/1462257' });
// });

export class Application {
    private _application = express();
    private staticDirectory = path.join(process.cwd(), 'src', 'public');
    private uploadDirectory = path.join(process.cwd(), 'uploads');
    constructor() {
        this.configure();
        this.setupLocalization();
        this.populateRoutes();
    }

    get application() {
        return this._application;
    }

    /**
     * configure the app instance
     * set app variables
     */
    private configure() {
        stage.test(StageLevel.PROD, () => {
            // this.application
            //     .use(Sentry.Handlers.requestHandler())
            //     .use(Sentry.Handlers.errorHandler());
        });

        this.application
            .use(cors({
                origin: '*',
                optionsSuccessStatus: 200,
            }))
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(morgan('dev'))
            .use(helmet())
            .use(compression())
            .use(express.static(this.staticDirectory))
            .use(express.static(this.uploadDirectory));

        // TODO Security
        // 1_ sql injection
        // 2_ csrf
        // 3_ xss
    }

    private populateRoutes() {
        this.application.use(ErrorHandling.favIcon);
        this.application.use((req, res, next) => {
            const acceptLanguage = req.acceptsLanguages();
            translation.use(acceptLanguage.includes('ar') ? 'ar' : 'en');
            next();
        });

        Wrapper.routers.forEach(({ router, uri }) => {
            this.application.use(path.join('/api', uri), router);
        });

        this.application.get('/api', (req, res) => res.status(200).json({ work: '/API hitted' }));
        this.application.get('/', (req, res) => res.sendFile('index.html'));
        this.application.use(ErrorHandling.notFound);
        this.application.use(ErrorHandling.catchError);
    }

    private setupLocalization() {
        translation.add('en', en);
        translation.add('ar', ar);
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
