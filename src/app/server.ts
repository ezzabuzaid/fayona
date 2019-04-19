import { Wrapper } from "./wrapper";
import { Application } from "./app";
import { ErrorHandling } from './core/helpers/errors';
import { localization } from '@lib/localization';
import { ServerLevel } from '@core/helpers';
import { Server as httpServer } from 'http';
import { appService } from './core';
import { Logger } from "./core/utils/logger.service";
import { URL } from 'url';
import { Database } from '@core/database/database';
import en from "../languages/en.json";
import dummyData from "../../data/local-air-quality.json";
import WebSocket from 'ws';
import puppeteer from 'puppeteer';
import path from 'path';
import { AppUtils } from '@core/utils';
const log = new Logger('Server init');

interface Element { }
interface Node { }
interface NodeListOf<TNode = Node> { }
export class Server extends Application {
        static LEVEL = ServerLevel.DEV;
        private port: number = +this.get('port');
        private host = this.get('host');

        /**
         * Invoke this method to start the server
         * @param port server port
         */
        static bootstrap(port: number): Promise<Server> {
                // SECTION server init event
                return Promise.resolve(new Server(port));
        }

        private resolverRouters() {
                // SECTION routes resolving event

                this.app.use('/api', ...Wrapper.routerList, (req, res) => res.status(200).json({ work: '/API hitted' }));
                this.app.use('/', (req, res) => {
                        res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
                });
                // catch favIcon request
                this.app.use(ErrorHandling.favIcon);

                // * Globally catch error
                this.app.use(ErrorHandling.catchError);

                // * catch not found error
                this.app.use(ErrorHandling.notFound);

        }

        private constructor(port: number) {
                super();
                port && (this.port = port);
                try {
                        this.init()

                } catch (error) {
                        throw new Error('Faild to init the server')
                }
        }

        /**
         * 
         * Start the server and return an instance of it.
         * @returns {Promise<httpServer>} 
         */
        private populateServer(): Promise<httpServer> {
                return new Promise<httpServer>((resolve) => {
                        const url = new URL(`http://${this.host}:${this.port}`);
                        const server = this.app.listen(+this.port, this.host, () => {
                                log.info(`${new Date()} Server running at ${url.origin}`)
                                resolve(server);
                                // SECTION server start event
                        });
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
                this.populateServer()
                        .then(server => {
                                const wss = new WebSocket.Server({ server });
                                wss.on('connection', (ws: WebSocket) => {
                                        const interval = setInterval(() => {
                                                ws.send(JSON.stringify(dummyData[Math.floor(dummyData.length * Math.random())]));
                                        }, 500);
                                        ws.on('close', () => clearInterval(interval));
                                        ws.on('error', () => clearInterval(interval));
                                        // ws.on('message', (message: string) => {
                                        //         console.log('received: %s', message);
                                        // });
                                });
                                // puppeteer
                                //         .launch().then((browser) => browser.newPage())
                                //         .then((page) => {
                                //                 page.goto('https://twitter.com/ezzabuzaid')
                                //                 return page;
                                //         })
                                //         .then((page) => page.content())
                                //         .then(function (html) {
                                //                 log.warn();
                                //         })
                                //         .catch(function (err) {
                                //                 //handle error
                                //         });
                                // AppUtils.getHtml('https://dev.tradehub.com/en/lp/workshops').then(console.log);

                        });
                Database.load();
                this.resolverRouters();
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


// This matching all route middleware under route instance (act as interceptor)
// use router.all('*', requireAuthentication, loadUser);
// or router.all('*', requireAuthentication)
// router.all('*', loadUser);

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


// use the same route for crud operation
// router.route('/users/:user_id')
//     .all(function (req, res, next) {
// runs for all HTTP verbs first
// think of it as route specific middleware!
//         next();
//     })
//     .get(function (req, res, next) {
//         res.json(req.user);
//     })
//     .put(function (req, res, next) {
//         // just an example of maybe updating the user
//         req.user.name = req.params.name;
//         // save user ... etc
//         res.json(req.user);
//     })
//     .post(function (req, res, next) {
//         next(new Error('not implemented'));
//     })
//     .delete(function (req, res, next) {
//         next(new Error('not implemented'));
//     });
