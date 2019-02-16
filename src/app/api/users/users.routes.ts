import { Request, Response, NextFunction, RouterOptions, Express } from 'express';
import { Router } from '@lib/core';
import { Post, Get, Put, Delete } from '@lib/methods';
import { ErrorResponse, SuccessResponse, ErrorHandling } from '@core/helpers';
import { UsersRepo } from './users.repo';
import { translate } from '@lib/localization';
import HttpStatusCodes = require('http-status-codes');

import { Logger, AppUtils } from '@core/utils';
import { Auth } from '@auth/auth';
const log = new Logger('User Router');

@Router('users', {
    middleware: [Auth.isAuthenticated]
})
export class UsersRouter {
    constructor() { }

    @Post('/')
    async register(req: Request, res: Response) {
        log.info('start register');

        // Validate the input
        const { username, password } = req.body;;

        if (await UsersRepo.userExist({ username })) {
            log.debug(`User with username ${username} is exist`);
            throw new ErrorResponse(translate('username_exist'), HttpStatusCodes.BAD_REQUEST);
        }

        log.warn('New user');

        const user = await UsersRepo.createUser({ username, password });
        const responseData = AppUtils.removeKey('password', user.toObject());

        const response = new SuccessResponse<{}>(responseData, translate('user_register_success'), HttpStatusCodes.CREATED);
        res.status(response.code).json(response);
    }

    @Put('/:id')
    async updateUser(req: Request, res: Response) {
        log.info('start updateUser');
        // Validate the input
        const { id } = req.params;
        const user = await UsersRepo.fetchUser({ _id: id });

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), HttpStatusCodes.NOT_ACCEPTABLE);
        }

        const { username } = req.body;
        user.set({ username });
        await user.save();
        const response = new SuccessResponse(user, translate('updated', { name: 'user' }), HttpStatusCodes.OK);
        res.status(response.code).json(response);
    }

    @Delete('/:id')
    async deleteUser(req: Request, res: Response) {
        log.info('start deleteUser');

        const { id } = req.params;
        const user = await UsersRepo.deleteUser({ _id: id });

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), HttpStatusCodes.NOT_ACCEPTABLE)
        }

        const response = new SuccessResponse(null, translate('delete_user'), HttpStatusCodes.OK);
        res.status(response.code).json(response);
    }

    @Get('/:id')
    async fetchUser(req: Request, res: Response) {
        log.info('start fetchUser');

        const { id } = req.params;
        const user = await UsersRepo.fetchUser({ _id: id }, { password: 0 });

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), HttpStatusCodes.NOT_ACCEPTABLE);
        }

        const response = new SuccessResponse(user, translate('fetch_user'));
        res.status(response.code).json(response);
    }

    @Get('/')
    async fetchUsers(req: Request, res: Response) {
        log.info('start fetchUsers');

        const users = await UsersRepo.fetchUsers({}, { password: 0 });

        const response = new SuccessResponse(users, translate('fetch_users'), HttpStatusCodes.OK);
        res.status(response.code).json(response);
    }

}
