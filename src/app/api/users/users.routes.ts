import { Auth } from '@api/portal/auth';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { Logger } from '@core/utils';
import { Delete, Get, Post, Put, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { UsersRepo } from './users.repo';
const log = new Logger('User Router');
@Router('users', {
    middleware: []
})
export class UsersRouter {

    @Post()
    public async register(req: Request, res: Response) {
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
        log.warn(user);
        log.warn(`New user created with username ${user.username}`);

        const response = new SuccessResponse(user, translate('user_register_success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put(':id', Auth.isAuthenticated)
    public async updateUser(req: Request, res: Response) {
        log.info('start updateUser');
        // Validate the input
        const { id } = req.params;
        const user = await UsersRepo.fetchEntityById(id).lean();

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
    public async deleteUser(req: Request, res: Response) {
        log.info('start deleteUser');

        const { id } = req.params;
        const user = await UsersRepo.deleteEntity(id);

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get(':id', Auth.isAuthenticated)
    public async fetchUser(req: Request, res: Response) {
        log.info('start fetchUser');

        const { id } = req.params;
        const user = await UsersRepo.fetchEntityById(id).lean();

        if (!user) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }

        const response = new SuccessResponse(user, translate('success'));
        res.status(response.code).json(response);
    }

    @Get('', Auth.isAuthenticated)
    public async fetchUsers(req: Request, res: Response) {
        log.info('start fetchUsers');

        const users = await UsersRepo.fetchEntities();

        const response = new SuccessResponse(users, translate('fetch_users'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

}
