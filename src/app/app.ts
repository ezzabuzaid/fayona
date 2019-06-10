import en from '@assets/languages/en.json';
import { ErrorHandling, stage, StageLevel } from '@core/helpers';
import { Logger } from '@core/utils';
import { Wrapper } from '@core/wrapper';
import { translation } from '@lib/translation';
import Sentry = require('@sentry/node');
import compression = require('compression');
import express = require('express');
import monitor = require('express-status-monitor');
import helmet = require('helmet');
import morgan = require('morgan');
// https://github.com/RafalWilinski/express-status-monitor
import path from 'path';
const log = new Logger('Application instance');

// FIXME for NAHED ONLY
import { Op } from 'sequelize';
import mysql from './playground/mysql';
import * as orders from './playground/orders';

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
            .use(monitor())
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(morgan('dev'))
            .use(helmet())
            .use(compression())
            .use(express.static(this.staticDirectory))
            .use(express.static(this.uploadDirectory));

        // TODO setup html view engine for angular

        const sequelize = mysql.load();
        orders.init(sequelize);
        let index = 0;
        this.application.get('/data', (req, res) => {
            setInterval(() => {
                log.warn(`2019-04-02T21:00:0${++index}.000Z`);
                orders.Orders
                    .findAll({
                        where: {
                            request_time: {
                                [Op.between]: ['2019-04-02T21:00:00.000Z', `2019-04-02T21:00:0${++index}.000Z`]
                            }
                        }
                    }).then((list) => {
                        console.log(JSON.stringify(list, undefined, 8));
                    });
                // res.json(json);
            }, 5000);
        });

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
                log.warn(acceptLanguage);
                if (acceptLanguage) {
                    // use localization here
                }
                next();
            });

            Wrapper.routerList.forEach(({ router, uri }) => {
                log.debug(uri);
                this.application.use(path.join('/api', uri), router);
            });
            this.application.get('/api', (req, res) => res.status(200).json({ work: '/API hitted' }));
            // this.application.get('/', (req, res) => res.sendFile('index.html'));

            // * catch favIcon request
            this.application.use(ErrorHandling.favIcon);

            // * catch not found error
            this.application.use(ErrorHandling.notFound);

            // * Globally catch error
            this.application.use(ErrorHandling.catchError);
            resolve(this.application);
        });
    }

    private setupLocalization() {
        translation.add('en', en);
        // localization.add('ar', ar);
        translation.use('en');
    }

    public get(key: string): string {
        return this.application.get(key);
    }

    public set<T>(key: string, value: T): T {
        this.application.set(key, value);
        return value;
    }
}

// TODO add lusca lib
