import { Router, Post, Get, Put, Delete } from "@lib/methods";
import { Request, Response } from 'express';
import { CountriesRepo } from './countries.repo';

import { Logger } from '@core/utils';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { translate } from '@lib/localization';
import { Auth } from '@api/portal/auth';
const log = new Logger('CountriesRoutes');

@Router('countries')
export class CountriesRoutes {

    constructor() { }

    @Post('/')
    async createCountry(req: Request, res: Response) {
        const { name_ar, name_en, placeId } = req.body;

        const entityExist = await CountriesRepo.entityExist({ placeId });
        if (entityExist) {
            log.debug(`Entity with name ${name_en} is exist`);
            throw new ErrorResponse(translate('entity_exist'), NetworkStatus.BAD_REQUEST);
        }

        const entity = await CountriesRepo.createEntity({ name_ar, name_en, placeId });
        log.info('New country created');

        const response = new SuccessResponse<{}>(entity, translate('created_success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put('/:id')
    async updateCountry(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await CountriesRepo.fetchEntity({ _id: id });
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
    async deleteCountry(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await CountriesRepo.deleteEntity({ _id: id });
        if (!entity) {
            log.debug(`Entity with id ${id} is not exist`);
            throw new ErrorResponse(translate('not_exist'), NetworkStatus.BAD_REQUEST);
        }

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('')
    async fetchCountries(req: Request, res: Response) {
        const entites = await CountriesRepo.fetchEntities();
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get(':id')
    async fetchCountry(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await CountriesRepo.fetchEntity({ _id: id }, {}, { lean: true });
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found', { name: 'counrty' }), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

}