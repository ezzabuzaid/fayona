import { Request, Response, NextFunction } from 'express';
import { Router } from '@lib/core';
import { Post, Get } from '@lib/methods';
import { ErrorResponse, SuccessResponse } from '@core/helpers';
import { UsersRepo } from './users.repo';
import { AppUtils, Logger } from '@core/utils';
import HttpStatusCodes = require('http-status-codes');
import auth from '@auth/auth';

const log = new Logger('User Router');

@Router('users')
export class UsersRouter {

    constructor() { }

    @Post('login')
    async login(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        const currentUser = await UsersRepo.getUser({ username });
        if (!!currentUser) {
            const isPasswordEqual = await currentUser.comparePassword(password);
            if (isPasswordEqual) {
                const responseData = AppUtils.removeKey('password', currentUser.toObject());
                responseData.token = await auth.generateToken({ id: currentUser.id });
                const response = new SuccessResponse(responseData, 'Register successfully', HttpStatusCodes.OK);
                res.status(response.code).json(response);
                return next();
            }
        }
        const response = new ErrorResponse('username or password wrong', HttpStatusCodes.CONFLICT);
        return res.status(response.code).json(response);
    }

    @Post('register')
    async register(req: Request, res: Response, next: NextFunction) {
        // Validate the input
        const { username, password } = req.body;
        const currentUser = await UsersRepo.getUser({ username });
        if (!!currentUser) {
            log.debug('cannot complete the register, user found');
            const response = new ErrorResponse('username_exist', HttpStatusCodes.BAD_REQUEST);
            return res.status(response.code).json(response);
        }
        const user = await UsersRepo.createUser({ username, password });
        const responseData = AppUtils.removeKey('password', user.toObject());

        // Send the response
        const response = new SuccessResponse<{}>(responseData, 'Register successfully', HttpStatusCodes.CREATED);
        res.status(response.code).json(response);
        next();
    }

    @Get('/')
    async fetchUsers(req: Request, res: Response, next: NextFunction) {
        const allUsers = await UsersRepo.find({}).select({ password: 0 });
        const response = new SuccessResponse(allUsers, 'Fetch all user', HttpStatusCodes.OK);
        res.status(response.code).json(response);
    }

}

// import { RequestHandlerParams, Router as expressRouter } from "express-serve-static-core";

// interface ExpressRouter {
//     new(options: RouterOptions): expressRouter;
// }

// class ExpressRouter implements ExpressRouter  {
//     constructor(options: RouterOptions) {
//         return (new (ex(options) as any));
//     }
// }


// const e = new ExpressRouter({});
// e.
// class T extends ExpressRouter {
//     constructor() {
//         super({});
//     }
// }

// new T()
