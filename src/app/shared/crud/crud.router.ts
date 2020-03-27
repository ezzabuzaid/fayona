import { CrudService } from './crud.service';
import { Post, Put, Delete, Get, Patch } from '@lib/methods';
import { Auth } from '@api/portal';
import { Request, Response } from 'express';
import { Responses } from '@core/helpers';
import { AppUtils } from '@core/utils';
import { Payload } from '@lib/mongoose';
import { Types } from 'mongoose';
import assert from 'assert';

// TODO: Generic SchemaType should inherit from RepoHooks interface which
//  will be used to fire onSave, onUpdate, onDelete, ..etc

export class CrudRouter<SchemaType, ServiceType extends CrudService<SchemaType> = CrudService<SchemaType>> {
    constructor(
        protected service: ServiceType & CrudService<SchemaType>
    ) {
        assert(AppUtils.notNullOrUndefined(service));
    }

    @Post('/', Auth.isAuthenticated)
    public async create(req: Request, res: Response) {
        // TODO: payload is not validated yet
        const result = await this.service.create(req.body);
        if (result.hasError) {
            return new Responses.BadRequest(result.data);
        }
        return new Responses.Created(result.data);
    }

    @Patch(':id', Auth.isAuthenticated)
    public async update(req: Request, res: Response) {
        const { id } = req.params;

        if (AppUtils.not(Types.ObjectId.isValid(id))) {
            throw new Responses.BadRequest('id_not_valid');
        }

        const result = await this.service.updateById(id, req.body);

        if (result.hasError) {
            return new Responses.BadRequest(result.data);
        }

        return result.data;
    }

    @Put(':id', Auth.isAuthenticated)
    public async set(req: Request, res: Response) {
        const { id } = req.params;

        if (AppUtils.not(Types.ObjectId.isValid(id))) {
            throw new Responses.BadRequest('id_not_valid');
        }

        const result = await this.service.updateById(id, req.body);

        if (result.hasError) {
            return new Responses.BadRequest(result.data);
        }

        return result.data;
    }

    @Delete('bulk', Auth.isAuthenticated)
    public async bulkDelete(req: Request, res: Response) {
        const { ids } = req.body as { ids: string[] };
        this._checkIfIdsIsValid(ids);

        const completion = await this.service.bulkDelete(ids);
        if (AppUtils.isFalsy(completion)) {
            return new Responses.BadRequest('one_of_entities_not_exist');
        }

        return null;
    }

    @Post('bulk', Auth.isAuthenticated)
    public async bulkUpdate(req: Request, res: Response) {
        const { entites } = req.body as { entites: Array<Payload<SchemaType>> };
        this._checkIfIdsIsValid(entites);

        const completion = await this.service.bulkUpdate(entites);
        if (AppUtils.isFalsy(completion)) {
            return new Responses.BadRequest('one_of_entities_not_exist');
        }

        return new Responses.Ok(null);
    }

    @Delete(':id', Auth.isAuthenticated)
    public async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (AppUtils.not(Types.ObjectId.isValid(id))) {
            throw new Responses.BadRequest('id_not_valid');
        }

        const result = await this.service.delete({ _id: id } as any);

        if (result.hasError) {
            return new Responses.BadRequest(result.data);
        }

        return result.data;
    }

    @Get(':id', Auth.isAuthenticated)
    public async fetchEntity(req: Request, res: Response) {
        const { id } = req.params;

        if (AppUtils.not(Types.ObjectId.isValid(id))) {
            throw new Responses.BadRequest('id_not_valid');
        }

        const entity = await this.service.one({ _id: id } as any);
        if (AppUtils.isNullOrUndefined(entity)) {
            return new Responses.BadRequest('entity_not_found');
        }
        return entity;
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

    private _checkIfIdsIsValid(ids: any[]) {
        if (AppUtils.not(AppUtils.hasItemWithin(ids))) {
            return new Responses.BadRequest('please_provide_valid_list_of_ids');
        }
    }

}
