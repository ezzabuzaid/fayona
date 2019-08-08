import { Auth } from '@api/portal';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { Logger } from '@core/utils';
import { Delete, Get, Post, Put, Router } from '@lib/methods';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { ContactUsRepo } from './contactUs.repo';
import { Constants } from '@core/helpers';
const log = new Logger('ContactUsRouter');

@Router(Constants.Endpoints.ContactUs)
export class ContactUsRouter {
    private repo = ContactUsRepo;

    @Post('', Auth.isAuthenticated)
    public async create(req: Request, res: Response) {
        const { email, name, enquiry, message } = req.body;
        const entity = await this.repo.createEntity({ email, name, enquiry, message });
        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put(':id', Auth.isAuthenticated)
    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const { email, name, enquiry, message } = req.body;
        const entity = await this.repo.updateEntity(id, { email, name, enquiry, message });
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Delete(':id', Auth.isAuthenticated)
    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.deleteEntity(id);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get(':id', Auth.isAuthenticated)
    public async fetchEntity(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.fetchEntityById(id).lean();
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'));
        res.status(response.code).json(response);
    }

    @Get()
    public async fetchEntities(req: Request, res: Response) {
        const entites = await this.repo.fetchEntities();
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }
}
