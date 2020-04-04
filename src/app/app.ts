import en from '@assets/languages/en.json';
import ar from '@assets/languages/ar.json';
import { ErrorHandling, StageLevel, wrapRoutes } from '@core/helpers';
import { Logger } from '@core/utils';
import { translation } from '@lib/translation';
import compression = require('compression');
import express = require('express');
import helmet = require('helmet');
import hpp = require('hpp');
import morgan = require('morgan');
import { Wrapper } from './wrapper';
import path from 'path';
import cors from 'cors';
import stage from '@core/helpers/stage';

const log = new Logger('Application');

export class Application {
    public application = express();
    public static staticDirectory = path.join(process.cwd(), 'src', 'public');
    public static uploadDirectory = path.join(process.cwd(), 'uploads');

    constructor() {
        this.configure();
        this.setupLocalization();
        this.populateRoutes();
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
            .use(express.urlencoded({ extended: false }))
            .use(hpp())
            .use(morgan('dev'))
            .use(helmet())
            .use(compression())
            .use(express.static(Application.staticDirectory))
            .use(express.static(Application.uploadDirectory, {
                index: 'index.html',
                maxAge: '10weeks',
            }));

    }

    private populateRoutes() {
        this.application.use((req, res, next) => {
            const acceptLanguage = req.acceptsLanguages();
            const localToUse = acceptLanguage.includes('ar') ? 'ar' : 'en';
            if (translation.local.name !== localToUse) {
                translation.use(localToUse);
            }
            next();
        });

        Wrapper.routers.forEach(({ router, uri }) => {
            this.application.use(path.join('/api', uri), router);
        });

        this.application.use(wrapRoutes(ErrorHandling.favIcon));
        this.application.get('/api', wrapRoutes(() => ({ work: '/API hitted' })));
        this.application.use(wrapRoutes(ErrorHandling.notFound));
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
