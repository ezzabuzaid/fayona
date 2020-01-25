import { Database } from '@core/database/database';
import { stage, StageLevel } from '@core/helpers';
import { Logger } from '@core/utils';
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
                envirnoment.load();
                const server = new NodeServer();
                await server.populateServer();
                await server.init();
                return server;
                // server.application.get('/socket/:name', handleSocket);
                // server.application.get('/webhooks/github/deploy', deploy);
        }

        public static async test() {
                envirnoment.load(StageLevel.TEST);
                const server = new NodeServer();
                await server.init();
                return server;
        }

        private constructor() {
                super();
                this.path = new URL(`http://${this.host}:${this.port}`);
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
                try {
                        this.databaseConnection = Database.load({ user, password, path, host, atlas: stage.production });
                } catch (error) {
                        throw new Error(`Faild to init the server ${error}`);
                }

        }

        databaseConnection = null;
}
