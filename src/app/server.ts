import { Database } from '@core/database/database';
import { stage, StageLevel } from '@core/helpers';
import { Logger, LoggerLevel } from '@core/utils';
import { envirnoment } from '@environment/env';
import http = require('http');
import { URL } from 'url';
import { Application } from './app';
import { OLHC, loadOHLCcsv, handleSocket } from './playground/olhc';
import { deploy } from './playground/deploy';
const log = new Logger('Server init');
export class NodeServer extends Application {
        private port = +envirnoment.get('PORT') || 8080;
        private host = envirnoment.get('HOST') || '127.0.0.1';
        public path: URL = null;

        /**
         * Invoke this method to start the server
         * @param port server port
         */
        public static async bootstrap() {
                // SECTION server init event
                log.debug('Start boostrapping server');
                envirnoment.load(StageLevel.DEV);
                const server = new NodeServer();
                const httpServer = await server.populateServer();
                // server.application.get('/socket/:name', handleSocket);
                // server.application.get('/webhooks/github/deploy', deploy);
                return server.init();
        }

        public static test() {
                Logger.level = LoggerLevel.Off;
                log.info('Start Testing');
                envirnoment.load(StageLevel.TEST);
                return (new NodeServer()).init();
        }

        private constructor() {
                super();
                this.path = new URL(`http://${this.host}:${this.port}`);
                log.info(`The env => ${stage.LEVEL}`);
        }

        /**
         *
         * Start the server and return an instance of it.
         * @returns {Promise<httpServer>}
         */
        private populateServer(): Promise<http.Server> {
                return Promise.resolve<http.Server>(this.startServer(this.createServer()));
        }

        private createServer() {
                //     key: fs.readFileSync('./key.pem'),
                //     cert: fs.readFileSync('./cert.pem'),
                //     passphrase: 'YOUR PASSPHRASE HERE'
                return http.createServer(this.application);
        }

        private startServer(server: http.Server) {
                return server.listen(this.path.port, +this.path.hostname, () => {
                        log.info(`${new Date()} Server running at ${this.path.href}`);
                        // SECTION server start event
                });
        }

        private init() {
                const {
                        MONGO_USER: user,
                        MONGO_PASSWORD: password,
                        MONGO_PATH: path,
                        MONGO_HOST: host
                } = envirnoment.env;
                log.debug(stage.LEVEL);
                try {
                        return Promise.all([
                                this.populateRoutes(),
                                Database.load({ user, password, path, host, atlas: stage.production }),
                        ]);
                } catch (error) {
                        throw new Error(`Faild to init the server ${error}`);
                }

        }
}
