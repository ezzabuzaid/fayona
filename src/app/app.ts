import en from '@assets/languages/en.json';
import ar from '@assets/languages/ar.json';
import { wrapRoutes, ErrorHandling } from '@core/helpers';
import { Logger } from '@core/utils';
import { translation } from '@lib/translation';
import compression = require('compression');
import express = require('express');
import helmet = require('helmet');
import hpp = require('hpp');
import morgan = require('morgan');
import { ApiFactory } from './wrapper';
import path from 'path';
import cors from 'cors';
import sanitize from 'express-mongo-sanitize';
import { Directories } from '@shared/common';

const log = new Logger('Application');

export class Application {
    public application = express();

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
        // TODO: Connect sentry
        this.application
            .use(cors({
                origin: '*',
                optionsSuccessStatus: 200,
            }))
            .use(express.json())
            .use(express.urlencoded({ extended: false }))
            .use(hpp())
            .use(morgan('dev'))
            .use(helmet({
                frameguard: false
            }))
            .use(compression())
            .use(sanitize())
            .use(express.static(Directories.staticDirectory))
            .use(express.static(Directories.uploadDirectory, {
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

        ApiFactory.routers.forEach(({ router, uri }) => {
            this.application.use(path.join('/api', uri), router);
        });

        this.application.use(wrapRoutes(ErrorHandling.favIcon));
        this.application.get('/api', wrapRoutes(() => ({ work: '/API hitted' })));
        this.application.use(wrapRoutes(ErrorHandling.notFound));
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
