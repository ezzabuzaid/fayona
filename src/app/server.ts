import { Application } from "./app";
import { localization } from '@lib/localization';
import { ServerLevel } from '@core/helpers';
import { Server as httpServer } from 'http';
import { appService } from './core';
import { Logger } from "./core/utils/logger.service";
import { URL } from 'url';
import { Database } from '@core/database/database';
import en from "@assets/languages/en.json";
import http = require('http');
import { Injectable } from '@decorators/di';
const log = new Logger('Server init');

@Injectable()
export class Server extends Application {
        static LEVEL = ServerLevel.DEV;
        private port = +this.get('port');
        private host = this.get('host');
        public path: URL = null;

        /**
         * Invoke this method to start the server
         * @param port server port
         */
        static bootstrap(port: number): Server {
                // SECTION server init event
                // return Promise.resolve();
                log.debug('Start boostrapping server');
                return new Server(port);
        }

        constructor(port: number) {
                super();
                port && (this.port = port);
                this.path = new URL(`http://${this.host}:${this.port}`)
                try {
                        this.init();

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
                Promise.all([this.populateServer(), Database.load(), this.populateRoutes()])
                this.setupLocalization();
                // refactor the "Reactor" class
                appService.broadcast(null);

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
