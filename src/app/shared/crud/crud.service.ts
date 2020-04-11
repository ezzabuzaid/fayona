import { ICrudOptions, ICrudHooks } from './crud.options';
import { Payload, WithID, Document, Projection, ColumnSort, PrimaryKey } from '@lib/mongoose';
import { AppUtils } from '@core/utils';
import { Repo, IReadAllOptions, Query } from './crud.repo';
import { translate } from '@lib/translation';

function getHooks<T>(options: Partial<ICrudHooks<T>>): { [key in keyof ICrudHooks<T>]: any } {
    return {
        pre: AppUtils.isFunction(options && options.pre) ? options.pre : (...args: any) => null,
        post: AppUtils.isFunction(options && options.post) ? options.post : (...args: any) => null,
        result: AppUtils.isFunction(options && options.result) ? options.result : null,
    };
}

class Result<T> {
    public hasError = false;
    public data: T = null;
    public message: string = null;

    constructor(result: Partial<Result<T>> = new Result<T>({})) {
        this.data = result.data;
        this.message = result.message || null;
        this.hasError = result.hasError ?? AppUtils.isTruthy(result.message) ?? false;
    }
}

export class CrudService<T = null> {

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
                    return `property${field} is missing`;
                }
                const record = await fetchOne(field);
                if (AppUtils.isTruthy(record)) {
                    return translate(`${this.options.unique[index]}_entity_exist`);
                }
            }
        }
        return false;
    }

    public async create(payload: Payload<T>): Promise<Result<WithID<T>>> {
        const isExist = await this.isEntityExist(payload);
        if (isExist) {
            return new Result({ message: isExist });
        }

        const entity = this.repo.create(payload);
        const { pre, post, result } = getHooks(this.options.create);
        await pre(entity);
        await entity.save();
        await post(entity);

        return result
            ? new Result<T>({ data: result(entity) })
            : new Result<T>({ data: { id: entity.id } as any });
    }

    public async delete(query: Query<T>) {
        const entity = await this.repo.fetchOne(query);
        if (AppUtils.isNullOrUndefined(entity)) {
            return new Result({ message: 'entity_not_exist' });
        }

        const { pre, post } = getHooks(this.options.delete);
        await pre(entity);
        await entity.remove();
        await post(entity);

        return new Result();
    }

    public async updateById(id: PrimaryKey, payload: Partial<Payload<T>>) {
        return this.doUpdate(await this.repo.fetchById(id), payload);
    }

    public async update(record: Document<T>, payload: Partial<Payload<T>>) {
        return this.doUpdate(record, payload);
    }

    private async doUpdate(record: Document<T>, payload: Partial<Payload<T>>) {
        if (AppUtils.isNullOrUndefined(record)) {
            return new Result({ message: 'entity_not_exist' });
        }

        const isExist = await this.isEntityExist(payload as any);
        if (isExist) {
            return new Result({ message: isExist });
        }

        const { pre, post } = getHooks(this.options.update);
        await pre(record);
        await record.set(payload).save();
        await post(record);

        return new Result();
    }

    public async set(id: PrimaryKey, payload: Payload<T>) {
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

    public async bulkDelete(ids: PrimaryKey[]) {
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

    public async one(query: Query<T>, options: Partial<IReadAllOptions<T>> = {}) {
        const { post, pre } = getHooks(this.options.one as any);
        const documentQuery = this.repo.fetchOne(query, options.projection, options);
        await pre(documentQuery);
        const record = await documentQuery.exec();
        if (AppUtils.isNullOrUndefined(record)) {
            return new Result<Document<T>>({ message: 'entity_not_exist' });
        }
        await post(record);

        return new Result<Document<T>>({ data: record });
    }

    public async all(query?: Query<T>, options: Partial<IReadAllOptions<T>> = {}) {

        const readOptions = new ReadAllOptions(options);
        const documentQuery = this.repo.fetchAll(query, readOptions);
        const documents = await documentQuery.exec();

        const count = await this.repo.fetchAll().estimatedDocumentCount();

        return new Result({
            data: {
                list: documents,
                length: documents.length,
                totalCount: count,
                pages: Math.ceil((count / readOptions.limit) || 0),
            }
        });
    }

    public async exists(query: Query<T>) {
        if (AppUtils.isTruthy(await this.one(query, { lean: true }))) {
            return new Result({ data: true }) as any;
        }
        return new Result({ data: false });
    }

}

class CrudQuery { }

class ReadAllOptions<T> {
    public skip = 0;
    public limit = null;
    public sort: ColumnSort<T> = null;
    public projection: Projection<T> = {};
    public lean = false;
    public populate = null;

    constructor({ page = 0, size = 0, sort, populate, projection, lean }: Partial<IReadAllOptions<T>>) {
        this.skip = +page * size || null;
        this.limit = +size || null;
        this.sort = sort;
        this.populate = populate;
        this.projection = projection;
        this.lean = lean;
    }
}
