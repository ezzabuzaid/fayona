import { ICrudOptions, ICrudHooks } from './crud.options';
import { Repo } from '@shared/crud/crud.repo';
import { Request, Response } from 'express';
import { Body, Document } from '@lib/mongoose';
import { DeepPartial } from 'mongoose';
import { AppUtils } from '@core/utils';

function getHooks<T>(options: Partial<ICrudHooks<T>>) {
    return {
        pre: !AppUtils.isNullOrUndefined(options) ? options.pre : (...args: any) => null,
        post: !AppUtils.isNullOrUndefined(options) ? options.pre : (...args: any) => null,
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
        // throw new ErrorResponse(translate('entity_exist'), NetworkStatus.BAD_REQUEST);

        const check = await this.check(body);
        if (check) {
            return null;
        }

        const entity = await new this.repo.model(body as DeepPartial<Document<T>>);

        const { pre, post } = getHooks(this.options.create);
        pre(entity);
        await entity.save();
        post(entity);

        return entity;
    }

    public async delete(query: Partial<Body<T>>) {
        const entity = await this.repo.fetchOne(query);
        if (!entity) {
            return null;
        }
        const { pre, post } = getHooks(this.options.delete);
        pre(entity);
        await entity.remove();
        post(entity);

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
        pre(entity);
        entity.set(req.body);
        await entity.save();
        post(entity);
        return entity;
    }

    public async one(query: Partial<Body<T>>) {
        return await this.repo.fetchOne(query);
    }

    public async all(req: Request, res: Response) {
        const entites = await this.repo.fetchAll();
        const hook = this.options.all;
        const post = !AppUtils.isNullOrUndefined(hook) && hook.post;
        post(entites);
        return entites;
    }

}
