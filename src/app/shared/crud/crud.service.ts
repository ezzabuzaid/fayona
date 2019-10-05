import { ICrudOptions, ICrudHooks } from './crud.options';
import { Repo } from '@shared/crud/crud.repo';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { translate } from '@lib/translation';
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
            const exist = (await Promise.all(opertaions)).every((operation) => !!operation);
            if (exist) {
                throw new ErrorResponse(translate('entity_exist'), NetworkStatus.BAD_REQUEST);
            }
        }
    }

    public async create(body: Partial<Body<T>>) {
        await this.check(body);
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
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
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
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        await this.check(req.body);

        const { pre, post } = getHooks(this.options.update);
        pre(entity);
        entity.set(req.body);
        await entity.save();
        post(entity);

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    public async one(query: Partial<Body<T>>) {
        const entity = await this.repo.fetchOne(query);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        return entity;
    }

    public async all(req: Request, res: Response) {
        const entites = await this.repo.fetchAll();
        const hook = this.options.all;
        const post = !AppUtils.isNullOrUndefined(hook) && hook.post;
        post(entites);
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        response.count = entites.length;
        res.status(response.code).json(response);
    }

}
