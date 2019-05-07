import { Router, Post, Get, Put, Delete } from "@lib/core";
import { Request, Response } from 'express';
import { CitiesRepo } from './cities.repo';
import { Logger } from '@core/utils';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { translate } from '@lib/localization';
import { Auth } from '@api/auth/auth';
import { CountriesRepo } from '@api/countries';
const log = new Logger('CountriesRoutes');

@Router('cities', {
    middleware: [Auth.isAuthenticated]
})
export class CitiesRoutes {

    @Post('/')
    async createCity(req: Request, res: Response) {
        const { name_ar, name_en, placeId, countryId } = req.body;

        const entityExist = await CitiesRepo.entityExist({ placeId });
        if (entityExist) {
            log.debug(`Entity with name ${name_en} is exist`);
            throw new ErrorResponse(translate('entity_exist'), NetworkStatus.BAD_REQUEST);
        }

        const entity = await CitiesRepo.create({ name_ar, name_en, placeId, countryId });
        log.info('New entity created');

        const response = new SuccessResponse<{}>(entity, translate('created_success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put('/:id')
    async updateCity(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await CitiesRepo.fetchEntity({ _id: id });
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
    async deleteCity(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await CitiesRepo.deleteEntity({ _id: id });
        if (!entity) {
            log.debug(`Entity with id ${id} is not exist`);
            throw new ErrorResponse(translate('not_exist'), NetworkStatus.BAD_REQUEST);
        }

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/')
    async fetchCities(req: Request, res: Response) {
        const entites = await CitiesRepo.fetchEntities();
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/:countryId')
    async fetchCitiesByCountryId(req: Request, res: Response) {
        const { countryId } = req.params;
        const entites = await CitiesRepo.fetchEntities({ countryId });
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/:id')
    async fetchCity(req: Request, res: Response) {
        const { id: _id } = req.params;
        const entity = await CitiesRepo.fetchEntity({ _id }, {}, { lean: true });
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

}