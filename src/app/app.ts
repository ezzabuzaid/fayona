import express = require('express');
import morgan = require('morgan');
import compression = require('compression');
import helmet = require('helmet');
import path from 'path';
import { Logger } from '@core/utils';
import { envirnoment, EnvirnomentStages } from '@environment/env';
import { Wrapper } from '@lib/core';
import { ErrorHandling, development } from '@core/helpers';
const log = new Logger('Application instance');

export class Application {
    private _application = express();
    constructor() {
        envirnoment.load(EnvirnomentStages.DEV);
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
            .use((morgan('dev')))
            .use(helmet())
            .use(compression());
        development(() => {
            this.set('host', envirnoment.get('HOST') || 'localhost');
        });
        // npm install && npm start
        console.log('port is ', process.env.PORT || envirnoment.get('PORT') || 8080);
        this.set('port', process.env.PORT || envirnoment.get('PORT') || 8080);
    }

    protected populateRoutes() {
        return new Promise((resolve) => {
            // SECTION routes resolving event
            // REVIEW {ISSUE} GET api/test reject to api
            this.application.use('/api', ...Wrapper.routerList, (req, res) => res.status(200).json({ work: '/API hitted' }));
            // REVIEW {ISSUE} GET apis reject to "/ root"
            // this.application.use('/', (req, res) => {
            //     res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
            // });

            // * catch favIcon request
            this.application.use(ErrorHandling.favIcon);

            // * Globally catch error
            this.application.use(ErrorHandling.catchError);

            // * catch not found error
            this.application.use(ErrorHandling.notFound);
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
