import { ICrudOptions } from './crud.options';
import { Repo } from '@shared/crud/crud.repo';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';
import { Body, Document } from '@lib/mongoose';
import { DeepPartial } from 'mongoose';
import { AppUtils } from '@core/utils';

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
        const options = this.options.create;
        const pre = !AppUtils.isNullOrUndefined(options) && options.pre;
        const post = AppUtils.isNullOrUndefined(options) && options.post;
        if (!!pre) {
            pre(entity);
        }
        entity.save();
        if (post) {
            post(entity);
        }
        return entity;
    }

    public async delete(query: Partial<Body<T>>) {
        const entity = await this.repo.fetchOne(query);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const options = this.options.delete;
        const pre = !AppUtils.isNullOrUndefined(options) && options.pre;
        const post = AppUtils.isNullOrUndefined(options) && options.post;
        if (!!pre) {
            pre(entity);
        }
        await entity.remove();
        if (post) {
            post(entity);
        }
        return entity;
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.fetchById(id);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        await this.check(req.body);
        const options = this.options.update;
        const pre = !AppUtils.isNullOrUndefined(options) && options.pre;
        const post = AppUtils.isNullOrUndefined(options) && options.post;
        if (!!pre) {
            pre(entity);
        }
        entity.set(req.body);
        entity.save();
        if (post) {
            post(entity);
        }
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
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        response.count = entites.length;
        res.status(response.code).json(response);
    }

}
