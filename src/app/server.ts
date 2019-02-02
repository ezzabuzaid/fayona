import { Wrapper } from "./wrapper";
import { Application } from "./app";
import { ErrorHandling } from './core/helpers/errors.service';
import { localization } from '@lib/localization';
import { ServerLevels } from '@core/helpers';
import { Server as httpServer } from 'http';
import { appService } from './core';
import en from "../languages/en.json";
import mongoose = require('mongoose');

import { Logger } from "./core/utils/logger.service";
const log = new Logger('Server init');

export class Server extends Application {
        static LEVEL = ServerLevels.DEV;
        private port = this.get('port');
        private host = this.get('host');

        /**
         * 
         * @param port server port
         * @param cb callback function, will be called when server start
         */
        static bootstrap(port): Promise<Server> {
                return Promise.resolve(new Server(port));
        }

        private resolverRouters() {
                this.app.use('/', ...Wrapper.routerList);
                
                // * Globally catch error
                this.app.use(ErrorHandling.catchError);
                
                // * catch not found error
                this.app.use(ErrorHandling.notFound);
        }

        private constructor(port) {
                super();
                port && (this.port = port);
                this.init().catch(() => new Error('Faild to init the server'));
        }

        private populateMongoose() {
                const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
                return mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-hp3qr.mongodb.net/${MONGO_PATH}`, { useNewUrlParser: true })
                        .then(() => log.info('Database Connected'))
                        .catch((error) => log.error("Database Not Connected", error))
        }

        /**
         * 
         * Call the app.listen to start the server
         * @returns {Promise<httpServer>} 
         */
        private populateServer(): Promise<httpServer> {
                const promise = new Promise<httpServer>((resolve) => {
                        const server = this.app.listen(this.port, this.host, () => {
                                const url = `http://${this.host}:${this.port};`
                                process.env['URL'] = url;
                                log.info(`${new Date()} Server running at ${url}`)
                                resolve(server);
                        });
                })
                return promise;
        }

        /**
         * 
         */
        private async init() {
                this.resolverRouters();
                localization.add('en', en);
                localization.use('en');
                // localization.add('ar', ar);
                // return it arrayAsObject
                await Promise.all([
                        this.populateServer(),
                        this.populateMongoose()
                ]);

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
