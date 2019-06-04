import { Database } from '@core/database/database';
import { stage, StageLevel } from '@core/helpers';
import { Logger } from '@core/utils';
import { envirnoment } from '@environment/env';
import { Server as httpServer } from 'http';
import http = require('http');
import { URL } from 'url';
import { Application } from './app';
const log = new Logger('Server init');

export class Server extends Application {
        private port = +envirnoment.get('PORT') || 8080;
        private host = envirnoment.get('HOST') || 'localhost';
        public path: URL = null;

        /**
         * Invoke this method to start the server
         * @param port server port
         */
        public static async bootstrap() {
                // SECTION server init event
                log.debug('Start boostrapping server');
                // TODO call load function implicitly in envirnoment load method
                envirnoment.load();
                stage.load();
                const server = new Server();
                server.populateServer();
                await server.init();
                return server;
        }

        public static async test() {
                log.info('Start Testing');
                // TODO call load function implicitly in envirnoment load method
                envirnoment.load(StageLevel.TEST);
                stage.load();
                const server = new Server();
                await server.init();
                return server;
        }

        private constructor() {
                super();
                this.path = new URL(`http://${this.host}:${this.port}`);
                log.info(`The env => ${stage.LEVEL}`);
                // try {
                //         this.init();
                // } catch (error) {
                //         throw new Error(`Faild to init the server ${error}`);
                // }
        }

        /**
         *
         * Start the server and return an instance of it.
         * @returns {Promise<httpServer>}
         */
        private populateServer(): Promise<httpServer> {
                return Promise.resolve<httpServer>(this.startServer(this.createServer()));
        }

        private createServer() {
                //     key: fs.readFileSync('./key.pem'),
                //     cert: fs.readFileSync('./cert.pem'),
                //     passphrase: 'YOUR PASSPHRASE HERE'
                return http.createServer(this.application);
        }

        private startServer(server: httpServer) {
                return server.listen(this.path.port, +this.path.hostname, () => {
                        log.info(`${new Date()} Server running at ${this.path.href}`);
                        // SECTION server start event
                });
        }

        private init() {
                const { MONGO_USER: user,
                        MONGO_PASSWORD: password,
                        MONGO_PATH: path,
                        MONGO_HOST: host } = envirnoment.env;
                return Promise.all([
                        Database.load({ user, password, path, host, atlas: false }),
                        this.populateRoutes()]);

        }
}

// const createDatabaseStatement = 'CREATE DATABASE testDB';
// const createTableStatement = `
// CREATE TABLE testTable (
//         id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         body VARCHAR(255) NOT NULL
// )`;

// router.use('/user', function (req, res, next) {
//     console.log('Request URL:', req.originalUrl)
//     next()
//   }, function (req, res, next) {
//     console.log('Request Type:', req.method)
//     next()
//   })
// Show the request info for any type of http method that call user
// ex:: cound how many user middleware called

// app.use(function (req, res, next) {
//     console.log('Time:', Date.now())
//     next()
// })
// Called every time (app here is application instance)

// app.use('/user/:id', function (req, res, next) {
//     console.log('Request Type:', req.method)
//     next()
// })
// Show the request info for any type of http method that call user
// (app here is application instance)

// to escape the next middleware call next('route')
// will escape the all middleware but next() will continue to next middleware at specific point

// This matching all route middleware under route instance and prefixed with api
// router.all('/api/*', requireAuthentication);

// this will only be invoked if the path starts with /bar from the mount point
// router.use('/bar', function (req, res, next) {
// ... maybe some additional /bar logging ...
//     next();
// });

// Intercept id param under route instance and called once at a time (intercept id param)

// router.param('id', function (req, res, next, id) {
//     console.log('CALLED ONLY ONCE');
//     next();
// });

// router.get('/user/:id', function (req, res, next) {
//     console.log('although this matches');
//     next();
// });

// router.get('/user/:id', function (req, res) {
//     console.log('and this matches too');
//     res.end();
// });
const schema = {
        id: {
                type: 'int UNSIGNED',
                value: 'AUTO_INCREMENT',
                key: 'PRIMARY KEY'
        },
        title: {
                type: 'VARCHAR(255)',
                value: 'NOT NULL'
        },
        body: {
                type: 'VARCHAR(255)',
                value: 'NOT NULL'
        }
};
function creataTable(tableName, columns) {
        const columnsNames = Object.keys(columns);
        const statement = columnsNames.reduce((statment, column, index) => {
                const { type, value, key = '' } = columns[column];
                let _statment = `${column} ${type} ${value} ${key}`;
                _statment = _statment.trim();
                if ((index + 1) !== columnsNames.length) {
                        _statment += ', ';
                }
                return `${statment}${_statment}`;
        }, '');
        return `CREATE TABLE ${tableName} (${statement})`;
}
const table = creataTable('FuckTableFromString', schema);
