import { CrudService } from './crud.service';
import { Post, Put, Delete, Get, Patch } from '@lib/methods';
import { Auth } from '@api/portal';
import { Request } from 'express';
import { Responses, HttpResultResponse } from '@core/helpers';
import { AppUtils } from '@core/utils';
import { Payload } from '@lib/mongoose';
import { Types } from 'mongoose';
import assert from 'assert';
import { isValidId } from '@shared/common';

// TODO: Generic SchemaType should inherit from RepoHooks interface which
//  will be used to fire onSave, onUpdate, onDelete, ..etc

export class CrudRouter<SchemaType, ServiceType extends CrudService<SchemaType> = CrudService<SchemaType>> {
    constructor(
        protected service: ServiceType & CrudService<SchemaType>
    ) {
        assert(AppUtils.notNullOrUndefined(service));
    }

    @Post('/', Auth.isAuthenticated)
    public async create(req: Request) {
        // TODO: payload is not validated yet
        const result = await this.service.create(req.body);
        if (result.hasError) {
            return new Responses.BadRequest(result.data);
        }
        return new Responses.Created(result.data);
    }

    @Patch(':id', Auth.isAuthenticated, isValidId())
    public async update(req: Request) {
        const { id } = req.params;

        const result = await this.service.updateById(id, req.body);

        if (result.hasError) {
            return new Responses.BadRequest(result.data);
        }

        return new Responses.Ok(result.data);
    }

    @Put(':id', Auth.isAuthenticated, isValidId())
    public async set(req: Request) {
        const { id } = req.params;

        const result = await this.service.updateById(id, req.body);

        if (result.hasError) {
            return new Responses.BadRequest(result.data);
        }

        return new Responses.Ok(result.data);
    }

    @Delete(':id', Auth.isAuthenticated, isValidId())
    public async delete(req: Request) {
        const { id } = req.params;

        const result = await this.service.delete({ _id: id } as any);

        const response = new HttpResultResponse(result.data);

        return result.hasError ? response.badRequest() : response.ok();
    }

    @Get(':id', Auth.isAuthenticated, isValidId())
    public async fetchEntity(req: Request) {
        const { id } = req.params;
        const result = await this.service.one({ _id: id } as any);
        const response = new HttpResultResponse(result.data);
        return result.hasError ? response.badRequest() : response.ok();
    }

    @Get('/', Auth.isAuthenticated)
    public async fetchEntities(req: Request) {
        // TODO: Check that the sort object has the same properties in <T>
        const { page, size, ...sort } = req.query;
        const result = await this.service.all({}, { sort, size, page });
        if (result.hasError) {
            return new Responses.BadRequest(result.data as any);
        }
        return new Responses.Ok(result.data);
    }

    @Delete('bulk', Auth.isAuthenticated)
    public async bulkDelete(req: Request) {
        const idsList = req.query.ids.split(',');

        if (this._checkIfIdsIsValid(idsList)) {
            return new Responses.BadRequest('please_provide_valid_list_of_ids');
        }

        const completion = await this.service.bulkDelete(idsList);
        if (AppUtils.isFalsy(completion)) {
            return new Responses.BadRequest('one_of_entities_not_exist');
        }

        return null;
    }

    @Post('bulk', Auth.isAuthenticated)
    public async bulkUpdate(req: Request) {
        const { entites } = req.body as { entites: Array<Payload<SchemaType>> };
        if (this._checkIfIdsIsValid(entites)) {
            return new Responses.BadRequest('please_provide_valid_list_of_ids');
        }
        const completion = await this.service.bulkUpdate(entites);
        if (AppUtils.isFalsy(completion)) {
            return new Responses.BadRequest('one_of_entities_not_exist');
        }

        return new Responses.Ok(null);
    }

    private _checkIfIdsIsValid(ids: any[]) {
        return AppUtils.not(AppUtils.hasItemWithin(ids));
    }

}
