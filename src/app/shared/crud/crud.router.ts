import { CrudService } from './crud.service';
import { Post, Put, Delete, Get, Patch } from '@lib/methods';
import { Request } from 'express';
import { Responses } from '@core/helpers';
import { AppUtils, cast } from '@core/utils';
import { Payload } from '@lib/mongoose';
import assert from 'assert';
import { isValidId } from '@shared/common';
import { IReadAllOptions } from './crud.repo';
import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationValidator implements IReadAllOptions<any> {
    @IsOptional()
    @IsNumberString()
    page: number = null;
    @IsOptional()
    @IsNumberString()
    size: number = null;
    // @IsOptional()
    // @IsObject()
    // sort: number = null;
}

export class CrudRouter<SchemaType, ServiceType extends CrudService<SchemaType> = CrudService<SchemaType>> {
    constructor(
        protected service: ServiceType & CrudService<SchemaType>
    ) {
        assert(AppUtils.notNullOrUndefined(service));
    }

    @Post('/')
    public async create(req: Request) {
        // TODO: payload is not validated yet
        const result = await this.service.create(req.body);
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Created(result.data);
    }

    @Patch(':id', isValidId())
    public async update(req: Request) {
        const { id } = cast(req.params);

        const result = await this.service.updateById(id, req.body);

        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }

        return new Responses.Ok(result.data);
    }

    @Put(':id', isValidId())
    public async set(req: Request) {
        const { id } = cast(req.params);

        const result = await this.service.updateById(id, req.body);

        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }

        return new Responses.Ok(result.data);
    }

    @Delete(':id', isValidId())
    public async delete(req: Request) {
        const { id } = req.params;

        const result = await this.service.delete({ _id: id } as any);
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Ok(result.data);
    }

    @Get(':id', isValidId())
    public async fetchEntity(req: Request) {
        const { id } = req.params;
        const result = await this.service.one({ _id: id } as any);
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Ok(result.data);
    }

    @Get('/')
    public async fetchEntities(req: Request) {
        // TODO: Check that the sort object has the same properties in <T>
        const { page, size, ...sort } = req.query;
        const result = await this.service.all({}, { sort, size, page });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Ok(result.data);
    }

    @Delete('bulk')
    public async bulkDelete(req: Request) {
        // FIXME will not work, the query array will be in queryPolluted
        const idsList = req.query.ids.split(',');

        if (AppUtils.isEmpty(idsList)) {
            return new Responses.BadRequest('please_provide_valid_list_of_ids');
        }

        const completion = await this.service.bulkDelete(idsList);
        if (AppUtils.isFalsy(completion)) {
            return new Responses.BadRequest('one_of_entities_not_exist');
        }

        return null;
    }

    @Post('bulk')
    public async bulkUpdate(req: Request) {
        const { entites } = req.body as { entites: Array<Payload<SchemaType>> };
        if (AppUtils.isEmpty(entites)) {
            return new Responses.BadRequest('please_provide_valid_list_of_ids');
        }
        const completion = await this.service.bulkUpdate(entites);
        if (AppUtils.isFalsy(completion)) {
            return new Responses.BadRequest('one_of_entities_not_exist');
        }

        return new Responses.Ok(null);
    }

}
