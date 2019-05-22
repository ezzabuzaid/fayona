import { Router, Post, Get, Put, Delete } from "@lib/core";
import { Request, Response } from 'express';
import { AuthorsRepo } from './authors.repo';
import { Logger } from '@core/utils';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { translate } from '@lib/localization';
import { Auth } from '@api/auth';
const log = new Logger('AuthorsRoutes');

@Router('authors')
export class AuthorsRoutes {

    @Post('/')
    async createAuthor(req: Request, res: Response) {
        const { name_ar, name_en, image, description } = req.body;

        const entityExist = await AuthorsRepo.entityExist({ name_en });
        if (entityExist) {
            log.debug(`Entity with name ${name_en} is exist`);
            throw new ErrorResponse(translate('entity_exist'), NetworkStatus.BAD_REQUEST);
        }

        const entity = await AuthorsRepo.createEntity({ name_ar, name_en, image, description });
        log.info('New author created');

        const response = new SuccessResponse<{}>(entity, translate('created_success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put('/:id')
    async updateAuthor(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await AuthorsRepo.fetchEntity({ _id: id });
        if (!entity) {
            log.debug(`Entity with id ${id} is not exist`);
            throw new ErrorResponse(translate('not_exist'), NetworkStatus.BAD_REQUEST);
        }

        const { name_ar, name_en, placeId } = req.body;
        entity.set({ name_ar, name_en, placeId });
        await entity.save();

        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Delete('/:id')
    async deleteAuthor(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await AuthorsRepo.deleteEntity({ _id: id });
        if (!entity) {
            log.debug(`Entity with id ${id} is not exist`);
            throw new ErrorResponse(translate('not_exist'), NetworkStatus.BAD_REQUEST);
        }

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/')
    async fetchAuthors(req: Request, res: Response, next) {
        const entites = await AuthorsRepo.fetchEntities();
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/:id')
    async fetchAuthor(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await AuthorsRepo.fetchEntity({ _id: id }, {}, { lean: true });
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

}