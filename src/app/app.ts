import express = require('express');
import morgan =  require('morgan');
import compression  =  require ('compression');
import helmet =  require( 'helmet');
import { environment } from '../environment/env';
import { Logger } from '@core/utils';

// import { Logger } from './core/utils/logger.service';
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
            .use((morgan('dev')))
            .use(helmet())
            .use((compression()))

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
