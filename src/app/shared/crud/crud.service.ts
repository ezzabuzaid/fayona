import { ICrudOptions, ICrudHooks } from './crud.options';
import { Payload, WithID, Document, Projection, ColumnSort, PrimaryKey } from '@lib/mongoose';
import { AppUtils } from '@core/utils';
import { Repo, Query, IReadOptions } from './crud.repo';
import { translate } from '@lib/translation';

function getHooks<T>(options: Partial<ICrudHooks<T>>): { [key in keyof ICrudHooks<T>]: any } {
    return {
        pre: (options && options.pre) ?? (() => { }),
        post: (options && options.post) ?? (() => { })
    };
}

class Result<T> {
    public hasError = false;
    public data: T = null;
    public message: string = null;

    constructor(result?: Partial<Result<T>>) {
        this.data = result.data ?? null;
        this.message = result.message ?? null;
        this.hasError = result.hasError ?? AppUtils.isTruthy(result.message) ?? false;
    }
}

export class WriteResult {
    updatedAt: string;
    createdAt: string;
    readonly id: PrimaryKey;
    _id: PrimaryKey;
    constructor(entity) {
        this.id = entity.id;
        this._id = entity.id;
        this.updatedAt = entity.updatedAt;
        this.createdAt = entity.createdAt;
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
                if (AppUtils.notNullOrUndefined(payload[field])) {
                    const record = await fetchOne(field);
                    if (AppUtils.isTruthy(record)) {
                        return translate(`${this.options.unique[index]}_entity_exist`);
                    }
                }
            }
        }
        return false;
    }

    public async create(payload: Payload<T>): Promise<Result<WriteResult>> {
        const isExist = await this.isEntityExist(payload);
        if (isExist) {
            return new Result({ message: isExist });
        }

        const entity = this.repo.create(payload);
        const { pre, post } = getHooks(this.options.create);
        await pre(entity);
        await entity.save();
        await post(entity);

        return new Result({ data: new WriteResult(entity) });
    }

    public async delete(query: Query<T>): Promise<Result<WriteResult>> {
        const entity = await this.repo.fetchOne(query);
        if (AppUtils.isNullOrUndefined(entity)) {
            return new Result({ message: 'entity_not_exist' });
        }

        const { pre, post } = getHooks(this.options.delete);
        await pre(entity);
        await entity.remove();
        await post(entity);

        return new Result({ data: new WriteResult(entity) });
    }

    public async updateById(id: PrimaryKey, payload: Partial<Payload<T>>) {
        return this.doUpdate(await this.repo.fetchById(id), payload);
    }

    public async update(record: Document<T>, payload: Partial<Payload<T>>) {
        return this.doUpdate(record, payload);
    }

    private async doUpdate(record: Document<T>, payload: Partial<Payload<T>>): Promise<Result<WriteResult>> {
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

        return new Result({ data: new WriteResult(record) });
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

    public async one(query: Query<T>, options: IReadOptions<T> = {}) {
        const documentQuery = this.repo.fetchOne(query, options.projection, options);
        const record = await documentQuery.exec();
        if (AppUtils.isNullOrUndefined(record)) {
            return new Result<Document<T>>({ message: 'entity_not_exist' });
        }
        return new Result<Document<T>>({ data: record });
    }

    public async all(query?: Query<T>, options: IReadOptions<T> = {}) {

        const readOptions = new ReadOptions(options);
        const documentQuery = this.repo.fetchAll(query, readOptions);
        const documents = await documentQuery.exec();
        const count = await this.repo.fetchAll().estimatedDocumentCount();

        return new Result({
            data: {
                list: documents,
                length: documents.length,
                totalCount: count,
                pages: Math.ceil((count / readOptions.limit) ?? 0),
            }
        });
    }

    public exists(query: Query<T>) {
        return this.one(query, { lean: true });
    }

}

class CrudQuery { }

class ReadOptions<T> {
    public skip = 0;
    public limit = null;
    public sort: ColumnSort<T> = null;
    public projection: Projection<T> = {};
    public lean = false;
    public populate = null;

    constructor({ page = 0, size = 0, sort, populate, projection, lean }: IReadOptions<T>) {
        this.skip = +page * size ?? null;
        this.limit = +size ?? 20;
        this.sort = sort;
        this.populate = populate;
        this.projection = projection;
        this.lean = lean;
    }
}
