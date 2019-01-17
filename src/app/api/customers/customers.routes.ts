// import { Request, Response, RouterOptions, NextFunction, Router as ex } from 'express';
// import { Wrapper } from '../../api';
// import { Router } from '../../../lib/core';
// import { Get } from '../../../lib/methods';
// import { RouterDec } from 'lib/typing';
// import { Router as expressRouter } from 'express-serve-static-core';

// @Router('router')
// export class CustomersRouter {

//     constructor() {
//         console.log('TestRoute Called', this);
//     }

//     intercept(req: Request, res: Response, next: NextFunction) {
//         console.log('intercept called');
//         next();
//     }

//     @Get('api')
//     getData(req: Request, res: Response, next: NextFunction) {
//         console.log('@Get called');
//         res.send({ getData: 'getData' });
//         next();
//     }

// }
