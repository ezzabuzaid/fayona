import { Application } from "./app";
import { localization } from '@lib/localization';
import { Server as httpServer } from 'http';
import { Logger } from "./core/utils/logger.service";
import { URL } from 'url';
import { Database } from '@core/database/database';
import { envirnoment, EnvirnomentStages } from '@environment/env';
import en from "@assets/languages/en.json";
import http = require('http');
import { stage } from '@core/helpers';
const log = new Logger('Server init');
export class Server extends Application {
        public static LEVEL = null;
        private port = +envirnoment.get('PORT') || 8080;
        private host = envirnoment.get('HOST') || 'localhost';
        public path: URL = null;

        /**
         * Invoke this method to start the server
         * @param port server port
         */
        static bootstrap(level: EnvirnomentStages): Server {
                // SECTION server init event
                log.debug('Start boostrapping server');
                envirnoment.load(level);
                stage.LEVEL = level;
                Server.LEVEL = level;
                return new Server();
        }

        static test() {
                log.debug('Start Testing');
                const level = EnvirnomentStages.TEST;
                envirnoment.load(level);
                stage.LEVEL = level;
                Server.LEVEL = level;
                return new Server();
        }


        private constructor() {
                super();
                this.path = new URL(`http://${this.host}:${this.port}`)
                try {
                        this.init();
                        !stage.testing && this.populateServer();
                } catch (error) {
                        throw new Error('Faild to init the server');
                }
        }

        /**
         * 
         * Start the server and return an instance of it.
         * @returns {Promise<httpServer>} 
         */
        private populateServer(): Promise<httpServer> {
                log.warn('stage.LEVEL => ', stage.LEVEL);
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
                        log.info(`${new Date()} Server running at ${this.path.href}`)
                        // SECTION server start event
                });
        }

        private setupLocalization() {
                localization.add('en', en);
                // localization.add('ar', ar);
                localization.use('en');
        }

        /**
         * 
         */
        private init() {
                const { MONGO_USER: user, MONGO_PASSWORD: password, MONGO_PATH: path, MONGO_HOST: host } = envirnoment.env;
                Database.load({ user, password, path, host, atlas: false })
                this.populateRoutes()
                this.setupLocalization();

        }
}



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
