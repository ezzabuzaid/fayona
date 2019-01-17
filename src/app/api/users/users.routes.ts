import { Request, Response, RouterOptions, NextFunction, Router as ex } from 'express';
import { Router } from '../../../lib/core';
import { Get, Post } from '../../../lib/methods';
import { UsersModel } from './users.model';
import { ErrorResponse, SuccessResponse } from '../../core/helpers/response';
import * as HttpStatusCodes from 'http-status-codes';
import auth from '../auth/auth';

import { AppUtils } from '../../core/utils/utils.service';

import { Logger } from '../../core/utils/logger.service';
const log = new Logger('User Router');

@Router('users')
export class UsersRouter {

    constructor() { }

    @Post('login')
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const currentUser = await UsersModel.getUser(username);
            if (!!currentUser) {
                const isPasswordEqual = await currentUser.comparePassword(password);
                if (isPasswordEqual) {
                    const responseData = AppUtils.removeKey('password', currentUser.toObject());
                    responseData.token = auth.generateToken({ id: currentUser.id });
                    const response = new SuccessResponse(responseData, 'Register successfully', HttpStatusCodes.OK);
                    res.status(response.code).json(response);
                    return next();
                }
            }
            const response = new ErrorResponse('Try to enter another username', HttpStatusCodes.CONFLICT);
            return res.status(response.code).json(response);
        } catch (error) {
            log.error('@Post Login error', error);
        }
    }

    @Post('register')
    async register(req: Request, res: Response, next: NextFunction) {
        // Validate the input
        try {
            const { username, password } = req.body;
            const currentUser = await UsersModel.getUser(username);
            log.debug(currentUser)
            if (!!currentUser) {
                const response = new ErrorResponse('Try to enter another username', HttpStatusCodes.BAD_REQUEST);
                return res.status(response.code).json(response);
            }
            const user = new UsersModel({ username, password })
            await user.save();
            const responseData = AppUtils.removeKey('password', user.toObject());
            const response = new SuccessResponse<{}>(responseData, 'Register successfully', HttpStatusCodes.CREATED);
            res.status(response.code).json(response);
            next();
        } catch (error) {
            log.error('@Post Register error', error);
        }
    }

}
