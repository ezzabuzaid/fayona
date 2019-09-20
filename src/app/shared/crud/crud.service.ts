import { ICrudOptions } from './crud.options';
import { Repo } from '@core/contracts/repo';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { translate } from '@lib/translation';
import { Request, Response } from 'express';

export class CrudService<T> {
    constructor(
        public repo: Repo<T>,
        private options: ICrudOptions<T> = {} as any
    ) { }

    public async create(req: Request, res: Response) {
        if (this.options.unique) {
            const opertaions = this.options.unique.map(async ({ attr }) => {
                return !!(await this.repo.fetchOne({ [attr]: req.body[attr] }));
            });
            const exist = (await Promise.all(opertaions)).every((operation) => !!operation);
            if (exist) {
                throw new ErrorResponse(translate('entity_exist'), NetworkStatus.BAD_REQUEST);
            }
        }
        const entity = await new this.repo.model(req.body);
        const pre = this.options.pre.create;
        const post = this.options.post.create;
        if (!!pre) {
            pre(entity);
        }
        entity.save();
        if (post) {
            post(entity);
        }
        const response = new SuccessResponse(entity.toJSON(), translate('success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.fetchById(id);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const pre = this.options.pre.delete;
        const post = this.options.post.delete;
        if (!!pre) {
            pre(entity);
        }
        await entity.remove();
        if (post) {
            post(entity);
        }
        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.fetchById(id);
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const pre = this.options.pre.update;
        const post = this.options.post.update;
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

    public async one(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await this.repo.fetchById(id).lean();
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'));
        res.status(response.code).json(response);
    }

    public async all(req: Request, res: Response) {
        const entites = await this.repo.fetchAll();
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        response.count = entites.length;
        res.status(response.code).json(response);
    }

}
