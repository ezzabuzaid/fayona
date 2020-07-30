import { Responses } from '@core/response';
import { AppUtils } from '@core/utils';
import { Payload, PrimaryKey, IColumnSort, SortDirection } from '@lib/mongoose';
import { FromBody, FromParams, FromQuery, HttpDelete, HttpGet, HttpPatch, HttpPost, HttpPut } from '@lib/restful';
import { PayloadValidator } from '@lib/validation';
import assert from 'assert';
import { IsNumberString, IsObject, IsOptional } from 'class-validator';
import { Request } from 'express';
import { CrudService } from './crud.service';

export class Pagination {
    @IsOptional()
    @IsNumberString()
    page?: number = null;
    @IsOptional()
    @IsNumberString()
    size?: number = null;
}

export class CrudRouter<SchemaType, ServiceType extends CrudService<SchemaType> = CrudService<SchemaType>> {
    constructor(
        protected service: ServiceType & CrudService<SchemaType>
    ) {
        assert(AppUtils.notNullOrUndefined(service));
    }

    @HttpPost('/')
    public async create(@FromBody() body) {
        // TODO: payload is not validated yet
        const result = await this.service.create(body);
        return new Responses.Created(result.data);
    }

    @HttpPatch(':id', )
    public async update(@FromParams('id') id: PrimaryKey, @FromBody() body) {
        const result = await this.service.updateById(id, body);
        return new Responses.Ok(result.data);
    }

    @HttpPut(':id')
    public async set(@FromParams('id') id: PrimaryKey, @FromBody() body) {
        const result = await this.service.updateById(id, body);
        return new Responses.Ok(result.data);
    }

    @HttpDelete(':id')
    public async delete(@FromParams('id') id: PrimaryKey) {
        const result = await this.service.delete({ _id: id } as any);
        return new Responses.Ok(result.data);
    }

    @HttpGet(':id')
    public async fetchEntity(@FromParams('id') id: PrimaryKey) {
        const result = await this.service.one({ _id: id } as any);
        return new Responses.Ok(result.data);
    }

    @HttpGet('/')
    public async fetchEntities(@FromQuery(Pagination) { page, size, ...sort }: Pagination) {
        // TODO: Check that the sort object has the same properties in <T>
        const result = await this.service.all({}, { size, page, sort: sort as any });
        return new Responses.Ok(result.data);
    }

    @HttpDelete('bulk')
    public async bulkDelete(req: Request) {
        // FIXME will not work, the query array will be in queryPolluted
        // const idsList = req.query.ids.split(',');

        // if (AppUtils.isEmpty(idsList)) {
        //     return new Responses.BadRequest('please_provide_valid_list_of_ids');
        // }

        // const completion = await this.service.bulkDelete(idsList);
        // if (AppUtils.isFalsy(completion)) {
        //     return new Responses.BadRequest('one_of_entities_not_exist');
        // }

        return null;
    }

    @HttpPost('bulk')
    public async bulkUpdate(req: Request) {
        const { entites } = req.body as { entites: Array<Payload<SchemaType>> };
        if (AppUtils.isEmpty(entites)) {
            return new Responses.BadRequest('please_provide_valid_list_of_ids');
        }
        const completion = await this.service.bulkUpdate(entites);
        if (AppUtils.not(completion)) {
            return new Responses.BadRequest('one_of_entities_not_exist');
        }

        return new Responses.Ok(null);
    }

}
