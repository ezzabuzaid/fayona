import express = require('express');
import morgan = require('morgan');
import compression = require('compression');
import helmet = require('helmet');
import { Envirnoment } from 'environment/env';

import { Logger } from '@core/utils';
const log = new Logger('Application instance');

export class Application {
    app = express();
    constructor() {
        Envirnoment.load();
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
            .use((compression()));

        this.set('host', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
        this.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080)
    }

    get(key: string): string {
        return this.app.get(key);
    }

    set<T>(key: string, value: T): T {
        this.app.set(key, value);
        return value;
    }
}

// TODO add lusca lib

// import { AssertionError } from 'assert';

// function handleAssertionError(error, req, res, next) {
//     if (error instanceof AssertionError) {
//         return res.status(400).json({
//             type: 'AssertionError',
//             message: error.message
//         });
//     }
//     next(error);
// }

// const { MongoError } = require('mongodb');

// app.use(function handleDatabaseError(error, req, res, next) {
//   if (error instanceof MongoError) {
//     return res.status(503).json({
//       type: 'MongoError',
//       message: error.message
//     });
//   }
//   next(error);
// });
