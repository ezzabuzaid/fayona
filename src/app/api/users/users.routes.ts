import { Request, Response, NextFunction, RouterOptions, Express } from 'express';
import { Router } from '@lib/core';
import { Post, Get, Put } from '@lib/methods';
import { ErrorResponse, SuccessResponse } from '@core/helpers';
import { UsersRepo } from './users.repo';
import { translate } from '@lib/localization';
import { Delete } from '@lib/methods/delete.decorator';
import HttpStatusCodes = require('http-status-codes');

import { AppUtils, Logger } from '@core/utils';
const log = new Logger('User Router');

@Router('users')
export class UsersRouter {

    constructor() { }

    @Post('/')
    async register(req: Request, res: Response, next: NextFunction) {
        // Validate the input
        const { username, password } = req.body;;

        if (await UsersRepo.userExist({ username })) {
            const response = new ErrorResponse(translate('username_exist'), HttpStatusCodes.BAD_REQUEST);
            res.status(response.code).json(response);
            next();
        }

        const user = await UsersRepo.createUser({ username, password });
        const responseData = AppUtils.removeKey('password', user.toObject());

        const response = new SuccessResponse<{}>(responseData, translate('user_register_success'), HttpStatusCodes.CREATED);
        res.status(response.code).json(response);
        next();
    }

    @Put('/:id')
    async updateUser(req: Request, res: Response, next: NextFunction) {
        // Validate the input
        const { id } = req.params;
        const user = await UsersRepo.fetchUser({ _id: id });
        let response;
        if (!user) {
            response = new ErrorResponse(translate('user_not_found'), HttpStatusCodes.BAD_REQUEST);
        } else {
            const { username } = req.body;
            user.set({ username })
            await user.save();
            response = new SuccessResponse(user, translate('user_updated'), HttpStatusCodes.OK);
        }
        res.status(response.code).json(response);
        next();
    }

    @Delete('/:id')
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const user = await UsersRepo.findByIdAndDelete(id);
        let response;
        if (!user) {
            response = new ErrorResponse(translate('user_not_found'), HttpStatusCodes.NOT_ACCEPTABLE)
        } else {
            response = new SuccessResponse(null, translate('delete_user'), HttpStatusCodes.OK);
        }
        res.status(response.code).json(response);
        next();
    }

    @Get('/:id')
    async fetchUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const currentUser = await UsersRepo.fetchUser({ _id: id });
        const response = new SuccessResponse(currentUser, translate('fetch_user'));

        if (!currentUser) {
            response.code = HttpStatusCodes.NO_CONTENT;
            // user not found
            // but the request successed
            // ask if throw an error is good
        }

        res.status(response.code).json(response);
        next();
    }

    @Get('/')
    async fetchUsers(req: Request, res: Response, next: NextFunction) {
        const allUsers = await UsersRepo.fetchUsers({});
        const response = new SuccessResponse(allUsers, translate('fetch_users'), HttpStatusCodes.OK);
        res.status(response.code).json(response);
        next();
    }

}

