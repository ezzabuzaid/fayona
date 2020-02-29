import { ICrudOptions, ICrudHooks } from './crud.options';
import { Body, WithID, WithMongoID, Document, Projection } from '@lib/mongoose';
import { AppUtils } from '@core/utils';
import { Repo } from './crud.repo';
import { translate } from '@lib/translation';
import mongoose, { ClientSession } from 'mongoose';

function getHooks<T>(options: Partial<ICrudHooks<T>>): { [key in keyof ICrudHooks<T>]: any } {
    return {
        pre: AppUtils.isFunction(options && options.pre) ? options.pre : (...args: any) => null,
        post: AppUtils.isFunction(options && options.post) ? options.post : (...args: any) => null,
    };
}

class Result {
    constructor(
        public hasError = false,
        public data = null
    ) { }
}

export class CrudService<T> {

    constructor(
        protected repo: Repo<T>,
        private options: ICrudOptions<T> = {} as any
    ) { }

    private async isEntityExist(body: Body<T>) {
        if (AppUtils.hasItemWithin(this.options.unique)) {
            const fetchOne = (field: keyof Body<T>) => this.repo.fetchOne({ [field]: body[field] } as any);
            for (let index = 0; index < this.options.unique.length; index++) {
                const field = this.options.unique[index];
                if (AppUtils.isNullOrUndefined(body[field])) {
                    return new Result(false, `property${field} is missing`);
                }
                const record = await fetchOne(field);
                if (AppUtils.isTruthy(record)) {
                    return new Result(true, this.options.unique[index]);
                }
            }
        }
        return new Result(false);
    }

    public async create(body: Body<T>, session: ClientSession = null) {
        const isExist = await this.isEntityExist(body);
        if (isExist.hasError) {
            return new Result(true, translate(`${isExist.data}_entity_exist`));
        }

        const entity = this.repo.create(body);
        const { pre, post } = getHooks(this.options.create);
        await pre(entity);
        await entity.save({ session });
        await post(entity);

        return new Result(false, { id: entity.id });
    }

    public async delete(query: Partial<Body<T>>) {
        const entity = await this.repo.fetchOne(query);
        if (!entity) {
            return new Result(true, 'entity_not_exist');
        }

        const { pre, post } = getHooks(this.options.delete);
        await pre(entity);
        await entity.remove();
        await post(entity);

        return new Result();
    }

    public async updateById(id: string, body: Partial<Body<T>>) {
        return this.doUpdate(await this.repo.fetchById(id), body);
    }

    public async update(record: Document<T>, body: Partial<Body<T>>) {
        return this.doUpdate(record, body);
    }

    private async doUpdate(record: Document<T>, payload: Partial<Body<T>>) {
        if (AppUtils.isFalsy(record)) {
            return new Result(true, 'entity_not_exist');
        }
        const isExist = await this.isEntityExist(payload as Body<T>);
        if (isExist.hasError) {
            return new Result(true, translate(`${isExist.data}_entity_exist`));
        }

        const { pre, post } = getHooks(this.options.update);

        await pre(record);
        await record.set(payload).save();
        await post(record);
        return new Result();
    }

    public async set(id: string, payload: Body<T>) {
        const record = await this.repo.fetchById(id);
        if (!record) {
            return new Result(true, 'entity_not_exist');
        }

        const isExist = await this.isEntityExist(payload);
        if (isExist.hasError) {
            return new Result(true, translate(`${isExist.data}_entity_exist`));
        }

        const { pre, post } = getHooks(this.options.update);
        await pre(record);
        await record.set(payload).save();
        await post(record);

        return new Result();
    }

    public async bulkUpdate(entites: Array<WithID<Body<T>>>) {
        // TODO: hooks should be called
        // TODO: all calls should be run within transaction
        const records = await Promise.all(entites.map((record) => this.repo.fetchById(record.id)));
        if (entites.every((item) => !!item)) {
            return null;
        }
        for (let index = 0; AppUtils.isFalsy(index); index++) {
            const entity = entites[index];
            const record = records[index];
            const { pre, post } = getHooks(this.options.update);
            await pre(record);
            await record.set(entity).save();
            await post(record);
        }
        return true;
    }

    public async bulkCreate(dtos: Array<Body<T>>) {
        for (const dto of dtos) {
            await this.create(dto);
        }
        return true;
    }

    public async bulkDelete(ids: string[]) {
        // TODO: add transaction
        const records = await Promise.all(ids.map((id) => this.repo.fetchById(id)));
        if (records.every((item) => !!item)) {
            return null;
        }
        const { pre, post } = getHooks(this.options.delete);
        const operations = records.map((record) => {
            return Promise.all([
                pre(record),
                record.remove(),
                post(record)
            ]);
        });
        await Promise.all(operations);
        return true;
    }

    public async one(query: Partial<WithMongoID<Body<T>>>, projection: Projection<T> = {}, ) {
        const record = await this.repo.fetchOne(query, projection);
        await getHooks(this.options.one).post(record)
        return record;
    }

    public async all(query: Partial<WithMongoID<Body<T>>> = {}, projection: Projection<T> = {}, options = {}) {
        const { pre, post } = getHooks(this.options.all);
        const documentQuery = this.repo.fetchAll(query, projection, options);
        await pre(documentQuery);
        const documents = await documentQuery;
        await post(documents);
        return documents;
    }

}

