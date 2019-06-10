import { Auth } from '@api/portal/auth';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { Logger } from '@core/utils';
import { Delete, Get, Post, Put, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { AdminRepo } from './admin.repo';
const log = new Logger('AdminRouter');

@Router('admin')
export class AdminRouter {

    @Post()
    public async register(req: Request, res: Response) {
        // REVIEW This endpoint must be restricted, no one should create main admin
        log.info('start register');

        // TODO Validate the input
        // see bitbucket or gmail or any login example

        const { username, password } = req.body;
        const checkUsername = await AdminRepo.entityExist({ username });
        if (checkUsername) {
            log.debug(`User with username ${username} is exist`);
            throw new ErrorResponse(translate('username_exist'), NetworkStatus.BAD_REQUEST);
        }

        const user = await AdminRepo.createEntity({ username, password });
        log.warn(user);
        log.warn(`New user created with username ${user.username}`);

        const response = new SuccessResponse(user, translate('user_register_success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    // @Put(':id', Auth.isAuthenticated)
    // public async updateUser(req: Request, res: Response) {
    //     log.info('start updateUser');
    //     // Validate the input
    //     const { id } = req.params;
    //     const user = await AdminRepo.fetchEntityById(id).lean();

    //     if (!user) {
    //         throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
    //     }

    //     const { username } = req.body;
    //     user.set({ username });
    //     await user.save();

    //     const response = new SuccessResponse(user, translate('updated', { name: 'user' }), NetworkStatus.OK);
    //     res.status(response.code).json(response);
    // }

    // @Delete(':id', Auth.isAuthenticated)
    // public async deleteAdmin(req: Request, res: Response) {

    //     const { id } = req.params;
    //     const entity = await AdminRepo.deleteEntity(id);

    //     if (!entity) {
    //         throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
    //     }

    //     const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
    //     res.status(response.code).json(response);
    // }

    // @Get(':id', Auth.isAuthenticated)
    // public async fetchUser(req: Request, res: Response) {

    //     const { id } = req.params;
    //     const entity = await AdminRepo.fetchEntityById(id).lean();

    //     if (!entity) {
    //         throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
    //     }

    //     const response = new SuccessResponse(entity, translate('success'));
    //     res.status(response.code).json(response);
    // }

    // @Get()
    // public async fetchAdmins(req: Request, res: Response) {

    //     const admins = await AdminRepo.fetchEntities();

    //     const response = new SuccessResponse(admins, translate('success'), NetworkStatus.OK);
    //     res.status(response.code).json(response);
    // }

}
