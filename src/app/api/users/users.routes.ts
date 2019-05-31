import { Request, Response } from 'express';
import { Post, Get, Put, Delete, Router } from '@lib/methods';
import { translate } from '@lib/localization';
import { ErrorResponse, SuccessResponse, NetworkStatus } from '@core/helpers';
import { UsersRepo } from './users.repo';
import { Auth } from '@api/portal/auth';
import { Logger, AppUtils } from '@core/utils';
const log = new Logger('User Router');
@Router('users', {
    middleware: []
})
export class UsersRouter {

    @Post('')
    async register(req: Request, res: Response) {
        log.info('start register');

        // TODO Validate the input
        const { username, password, email } = req.body;
        const checkUsername = await UsersRepo.entityExist({ username });
        if (checkUsername) {
            log.debug(`User with username ${username} is exist`);
            throw new ErrorResponse(translate('username_exist'), NetworkStatus.BAD_REQUEST);
        }

        const checkEmail = await UsersRepo.entityExist({ email });
        if (checkEmail) {
            log.debug(`User with Email ${email} is exist`);
            throw new ErrorResponse(translate('email_exist'), NetworkStatus.BAD_REQUEST);
        }

        const user = await UsersRepo.createEntity({ username, password, email });
        log.warn(`New user created with username ${user.username}`);

        const response = new SuccessResponse(user, translate('user_register_success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put(':id', Auth.isAuthenticated)
    async updateUser(req: Request, res: Response) {
        log.info('start updateUser');
        // Validate the input
        const { id } = req.params;
        const user = await UsersRepo.fetchEntity({ _id: id }, {}, { lean: true });

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }

        const { username } = req.body;
        user.set({ username });
        await user.save();

        const response = new SuccessResponse(user, translate('updated', { name: 'user' }), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Delete(':id', Auth.isAuthenticated)
    async deleteUser(req: Request, res: Response) {
        log.info('start deleteUser');

        const { id } = req.params;
        const user = await UsersRepo.deleteEntity({ _id: id });

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE)
        }

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get(':id', Auth.isAuthenticated)
    async fetchUser(req: Request, res: Response) {
        log.info('start fetchUser');

        const { id } = req.params;
        const user = await UsersRepo.fetchEntity({ _id: id }).lean();

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }

        const response = new SuccessResponse(user, translate('success'));
        res.status(response.code).json(response);
    }

    @Get('', Auth.isAuthenticated)
    async fetchUsers(req: Request, res: Response) {
        log.info('start fetchUsers');

        const users = await UsersRepo.fetchEntities();

        const response = new SuccessResponse(users, translate('fetch_users'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

}
