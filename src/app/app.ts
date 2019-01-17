import express = require('express');
import { config as envConfig } from "dotenv";
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppUtils } from './core/utils';
import * as  session from 'express-session';
import { Passport } from './core/config/passport';

import { Logger } from './core/utils/logger.service';
import { environment } from '../environment/env';
const log = new Logger('Application instance');

export class Application {
    app = express();
    constructor() {
        environment.load();
        this.configure();
        this.allowCors();
    }

    get applicationInstance() {
        return this.app;
    }

    /**
     ** allow cross origin restriction
     *? see the difference in cors package
     */
    private allowCors() {
        this.app.use((req, res, next) => {
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
        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use((morgan('dev') as any))
            .use(helmet())
            .use((compression() as any))

        this.set('host', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
        this.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080)
    }

    get(key: string) {
        return this.app.get(key);
    }

    set<T>(key: string, value: T): T {
        this.app.set(key, value);
        return value;
    }
}

// const application = new Application();
// export const app = application.applicationInstance as express.Application;
// export const instance = application;

// TODO add lusca lib
