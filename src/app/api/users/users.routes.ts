import { Request, Response, NextFunction } from 'express';
import { Router } from '@lib/core';
import { Post, Get } from '@lib/methods';
import { ErrorResponse, SuccessResponse } from '@core/helpers';
import { UsersRepo } from './users.repo';
import HttpStatusCodes = require('http-status-codes');

import { translate } from '@lib/localization';

import { AppUtils, Logger } from '@core/utils';
const log = new Logger('User Router');

@Router('users')
export class UsersRouter {

    constructor() { }

    @Post('/')
    async register(req: Request, res: Response, next: NextFunction) {
        // Validate the input
        const { username, password } = req.body;
        const currentUser = await UsersRepo.fetchUser({ username });

        if (!!currentUser) {
            log.debug('cannot complete the register, user found');
            const response = new ErrorResponse(translate('username_exist'), HttpStatusCodes.BAD_REQUEST);
            return res.status(response.code).json(response);
        }

        const user = await UsersRepo.createUser({ username, password });
        const responseData = AppUtils.removeKey('password', user.toObject());

        const response = new SuccessResponse<{}>(responseData, translate('user_register_success'), HttpStatusCodes.CREATED);
        res.status(response.code).json(response);
        next();
    }

    @Get('/')
    async fetchUsers(req: Request, res: Response, next: NextFunction) {
        const allUsers = await UsersRepo.fetchUsers({}, '-password');
        const response = new SuccessResponse(allUsers, translate('fetch_users'), HttpStatusCodes.OK);
        res.status(response.code).json(response);
    }

    
    // @Put('/:id')
    // async updateUser() {

    // }

    @Get('/:id')
    async fetchUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const currentUser = await UsersRepo.fetchUser({ _id: id }, '-password');

        const response = new SuccessResponse(currentUser, translate('fetch_user'), HttpStatusCodes.OK);
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
