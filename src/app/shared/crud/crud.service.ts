import { ICrudOptions, ICrudHooks } from './crud.options';
import { Body, Document } from '@lib/mongoose';
import { AppUtils } from '@core/utils';
import { Repo } from './crud.repo';

function getHooks<T>(options: Partial<ICrudHooks<T>>) {
    return {
        pre: !AppUtils.isNullOrUndefined(options && options.pre) ? options.pre : (...args: any) => null,
        post: !AppUtils.isNullOrUndefined(options && options.post) ? options.post : (...args: any) => null,
    };
}

export class CrudService<T> {

    constructor(
        protected repo: Repo<T>,
        private options: ICrudOptions<T> = {} as any
    ) { }

    private async check(body) {
        if (this.options.unique) {
            const opertaions = this.options.unique.map(async (field) => {
                return !!(await this.repo.fetchOne({ [field]: body[field] } as any));
            });
            return (await Promise.all(opertaions)).every((operation) => !!operation);
        }
        return false;
    }

    public async create(body: Body<T>) {
        // TODO: customize the return object to clarify what's exactly the error

        const check = await this.check(body);
        if (check) {
            return {
                exist: true,
                entity: null
            };
        }
        const entity = this.repo.create(body);
        const { pre, post } = getHooks(this.options.create);
        await pre(entity);
        await entity.save();
        await post(entity);

        return {
            exist: false,
            entity
        };
    }

    public async delete(query: Partial<Body<T>>) {
        const entity = await this.repo.fetchOne(query);
        if (!entity) {
            return null;
        }
        const { pre, post } = getHooks(this.options.delete);
        await pre(entity);
        await entity.remove();
        await post(entity);

        return entity;
    }

    // NOTE: Not used, for the sake of hook in write operations
    // public bulkDelete(ids: string[]) {
    //     return this.repo.model.bulkWrite(ids.map((_id) => ({ deleteOne: { filter: { _id } } })));
    // }

    // TODO: update is only for partials update, refactor it to agree with is
    // TODO: do `put` is only for replace the whole document with new one

    public async update(query: { body: Partial<Body<T>>, id: string }) {
        const entity = await this.repo.fetchById(query.id);
        if (!entity) {
            return null;
        }
        const check = await this.check(query.body);

        if (check) {
            return {
                exist: true,
                entity: null
            };
        }

        const { pre, post } = getHooks(this.options.update);
        await pre(entity);
        entity.set(query.body);
        await entity.save();
        await post(entity);
        return entity;
    }

    public async bulkUpdate(ids: Array<Body<T>>) {
        const entites = await Promise.all(ids.map((record) => this.repo.fetchById(record.id)));
        if (entites.every((item) => !!item)) {
            return null;
        }
        for (let index = 0; !index; index++) {
            const entity = entites[index];
            const record = ids[index];
            const { pre, post } = getHooks(this.options.update);
            await pre(entity);
            entity.set(record);
            await entity.save();
            await post(entity);
        }
        return true;
    }

    public async bulkDelete(ids: string[]) {
        const entites = await Promise.all(ids.map((id) => this.repo.fetchById(id)));
        if (entites.every((item) => !!item)) {
            return null;
        }
        const { pre, post } = getHooks(this.options.delete);
        for (const entity of entites) {
            await pre(entity);
            await entity.remove();
            await post(entity);
        }
        return true;
    }

    public async one(query: Partial<Body<T>>) {
        const entity = await this.repo.fetchOne(query);
        await getHooks(this.options.one).post(entity);
        return entity;
    }

    public async all(query = {}, projection: Projection<T> = {}, options = {}) {
        const entites = await this.repo.fetchAll(query, projection, options);
        const hook = this.options.all;
        const post = !AppUtils.isNullOrUndefined(hook) ? hook.post : () => null;
        await post(entites);
        return entites;
    }

}

type Projection<T> = Partial<{ [key in keyof Body<T>]: 1 | 0 }>;
