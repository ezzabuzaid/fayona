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
import Kafka = require('no-kafka');
import morgan = require('morgan');

// https://github.com/RafalWilinski/express-status-monitor
import path from 'path';
const log = new Logger('Application instance');

// FIXME for NAHED ONLY
import { Op } from 'sequelize';
import mysql from './playground/mysql';
import * as orders from './playground/orders';
import { Message } from 'no-kafka';

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

        // const sequelize = mysql.load();
        // orders.init(sequelize);

        // this.application.get('/data', (req, res) => {
        // tslint:disable-next-line: max-line-length
        // REVIEW  check for data each seconds {https://technology.amis.nl/2017/02/13/kafka-streams-and-nodejs-consuming-and-periodically-reporting-in-node-js-on-the-results-from-a-kafka-streams-streaming-analytics-application/}
        // NOTE cache the recent result and append them to the newest one since the result should be cumulative
        // _O_().then((list) => {
        // res.json(list.map((_) => _.get('request_time')));
        // });
        // });

        // const time = {
        //     second: 0,
        //     minute: 0,
        //     hour: 21
        // };
        // function _O_() {
        //     const formatDate = (() => {
        //         ++time.second;
        //         if (time.second > 59) {
        //             ++time.minute;
        //             time.second = 0;
        //         }
        //         if (time.minute > 59) {
        //             ++time.hour;
        //             time.minute = 0;
        //         }
        //         if (time.hour > 23) {
        //             time.hour = 0;
        //             // increase the Day.
        //         }
        //         return { ...time };
        //     })();
        //     const offset = (new Date()).getTimezoneOffset() / -60;
        //     const atMust = new Date(2019, 4 - 1, 2, formatDate.hour + offset, formatDate.minute, formatDate.second, 0);
        //     log.warn(atMust);
        //     return orders.Orders
        //         .findAll({
        //             where: {
        //                 request_time: {
        //                     [Op.between]: ['2019-04-02T21:00:00.000Z', atMust]
        //                 }
        //             }
        //         });
        // }
        // setInterval(() => {
        // _O_()
        //     .then((list) => list.map((_) => _.get('request_time')))
        //     .then(console.log);
        // }, 5000);
        // const producer = new Kafka.Producer({
        //     connectionString: process.env.KAFKA_URL
        //   });
        // const kafka = new Kafka.HighLevelProducer({
        //     clientId: 'my-app',
        //     brokers: ['kafka:9092']
        // });
        // const producer = new Kafka.Producer({
        //     connectionString: 'kafka:9092'
        // });
        // producer.init()
        //     .then(_O_)
        //     .then((list) => list.map((_) => _.get('request_time')))
        //     .then((value) => {
        //         return producer.send({
        //             topic: 'sales-topic',
        //             partition: 0,
        //             message: {
        //                 value: (value as any)
        //             }
        //         });
        //     }).catch(console.log);

        // const consumer = kafka.consumer({ groupId: 'test-group' })

        // await consumer.connect()
        // await consumer.subscribe({ topic: 'test-topic' })

        // await consumer.run({
        //     eachMessage: async ({ topic, partition, message }) => {
        //         console.log({
        //             value: message.value.toString(),
        //         })
        //     },
        // })

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
                this.application.use(path.join('/api', uri), router);
            });

            this.application.get('/api', (req, res) => res.status(200).json({ work: '/API hitted' }));
            this.application.post('/api', (req, res) => {
                console.log(JSON.stringify(req.body, undefined, 4));
                res.status(201).json({ status: 'ok' });
            });
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
