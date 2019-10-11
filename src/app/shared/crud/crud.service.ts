import { ICrudOptions, ICrudHooks } from './crud.options';
import { Repo } from '@shared/crud/crud.repo';
import { Request, Response } from 'express';
import { Body, Document } from '@lib/mongoose';
import { DeepPartial } from 'mongoose';
import { AppUtils } from '@core/utils';

function getHooks<T>(options: Partial<ICrudHooks<T>>) {
    return {
        pre: !AppUtils.isNullOrUndefined(options && options.pre) ? options.pre : (...args: any) => null,
        post: !AppUtils.isNullOrUndefined(options && options.post) ? options.post : (...args: any) => null,
    };
}

export class CrudService<T> {
    constructor(
        public repo: Repo<T>,
        private options: ICrudOptions<T> = {} as any
    ) { }

    private async check(body) {
        if (this.options.unique) {
            const opertaions = this.options.unique.map(async ({ attr }) => {
                return !!(await this.repo.fetchOne({ [attr]: body[attr] } as any));
            });
            return (await Promise.all(opertaions)).every((operation) => !!operation);
        }
        return false;
    }

    public async create(body: Partial<Body<T>>) {
        // TODO: customize the return object to clarify what's exactly the error

        const check = await this.check(body);
        if (check) {
            return {
                exist: true,
                entity: null
            };
        }

        const entity = await new this.repo.model(body as DeepPartial<Document<T>>);

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

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.fetchById(id);
        if (!entity) {
            return null;
        }
        const check = await this.check(req.body);

        if (check) {
            return null;
        }

        const { pre, post } = getHooks(this.options.update);
        await pre(entity);
        entity.set(req.body);
        await entity.save();
        await post(entity);
        return entity;
    }

    public async one(query: Partial<Body<T>>) {
        const { post } = getHooks(this.options.one);
        const entity = await this.repo.fetchOne(query);
        await post(entity);
        return entity;
    }

    public async all() {
        const entites = await this.repo.fetchAll();
        const hook = this.options.all;
        const post = !AppUtils.isNullOrUndefined(hook) ? hook.post : () => null;
        await post(entites);
        return entites;
    }

}
