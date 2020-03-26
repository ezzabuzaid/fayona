import { ICrudOptions, ICrudHooks } from './crud.options';
import { Payload, WithID, WithMongoID, Document, Projection, ColumnSort } from '@lib/mongoose';
import { AppUtils } from '@core/utils';
import { Repo } from './crud.repo';
import { translate } from '@lib/translation';

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

    private async isEntityExist(payload: Payload<T>) {
        if (AppUtils.hasItemWithin(this.options.unique)) {
            const fetchOne = (field: keyof Payload<T>) => this.repo.fetchOne({ [field]: payload[field] } as any);
            for (let index = 0; index < this.options.unique.length; index++) {
                const field = this.options.unique[index];
                if (AppUtils.isNullOrUndefined(payload[field])) {
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

    public async create(payload: Payload<T>) {
        const isExist = await this.isEntityExist(payload);
        if (isExist.hasError) {
            return new Result(true, translate(`${isExist.data}_entity_exist`));
        }

        const entity = this.repo.create(payload);
        const { pre, post } = getHooks(this.options.create);
        await pre(entity);
        await entity.save();
        await post(entity);

        return new Result(false, { id: entity.id });
    }

    public async delete(query: Partial<WithMongoID<Payload<T>>>) {
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

    public async updateById(id: string, payload: Partial<Payload<T>>) {
        return this.doUpdate(await this.repo.fetchById(id), payload);
    }

    public async update(record: Document<T>, payload: Partial<Payload<T>>) {
        return this.doUpdate(record, payload);
    }

    private async doUpdate(record: Document<T>, payload: Partial<Payload<T>>) {
        if (AppUtils.isFalsy(record)) {
            return new Result(true, 'entity_not_exist');
        }

        const isExist = await this.isEntityExist(payload as Payload<T>);
        if (isExist.hasError) {
            return new Result(true, translate(`${isExist.data}_entity_exist`));
        }

        const { pre, post } = getHooks(this.options.update);
        await pre(record);
        await record.set(payload).save();
        await post(record);

        return new Result();
    }

    public async set(id: string, payload: Payload<T>) {
        return this.updateById(id, payload);
    }

    public async bulkUpdate(entites: Array<WithID<Payload<T>>>) {
        // TODO: to be tested
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

    public async bulkCreate(payloads: Array<Payload<T>>) {
        // TODO: to be tested
        for (const payload of payloads) {
            await this.create(payload);
        }
        return new Result();
    }

    public async bulkDelete(ids: string[]) {
        // TODO: to be tested
        // TODO: add transaction
        const records = await Promise.all(ids.map((id) => this.repo.fetchById(id)));
        if (records.every(AppUtils.isTruthy)) {
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

    public async one(query: Partial<WithMongoID<Payload<T>>>, options: Partial<IReadAllOptions<T>> = {}) {
        const { post, pre } = getHooks(this.options.one as any);
        const documentQuery = this.repo.fetchOne(query, options.projection, options);
        await pre(documentQuery);
        const record = await documentQuery.exec();
        await post(record);
        return record;
    }

    public async all(query: Partial<WithMongoID<Payload<T>>> = {}, options: Partial<IReadAllOptions<T>> = {}) {
        const { pre, post } = getHooks(this.options.all as any);

        const readOptions = new ReadAllOptions(options);
        const documentQuery = this.repo.fetchAll(query, readOptions.projection, readOptions);
        await pre(documentQuery);
        const documents = await documentQuery.exec();
        await post(documents);

        const count = await documentQuery.estimatedDocumentCount();

        return new Result(false, {
            list: documents,
            count: documents.length,
            totalCount: count,
            pages: Math.ceil((count / readOptions.limit) || 0),
        });
    }

    public async exists(query: Partial<WithMongoID<Payload<T>>>) {
        if (AppUtils.isTruthy(await this.one(query, { lean: true }))) {
            return new Result();
        }
        return new Result(true, 'entity_not_exist');
    }

}

class CrudQuery { }
interface IReadOneOptions<T> {
    projection: Projection<T>;
    lean: boolean;
}

interface IReadAllOptions<T> extends IReadOneOptions<T> {
    sort: ColumnSort<T>;
    page: number;
    size: number;
}

class ReadAllOptions<T> {
    public skip = 0;
    public limit = null;
    public sort: ColumnSort<T> = null;
    public projection: Projection<T> = {};
    public lean = false;

    constructor({ page = 0, size = 0, sort }: Partial<IReadAllOptions<T>>) {
        this.skip = page * size || null;
        this.limit = size || null;
        this.sort = sort;
    }
}
