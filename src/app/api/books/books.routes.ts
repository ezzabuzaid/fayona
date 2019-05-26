import { Router, Post, Get, Put, Delete } from "@lib/methods";
import { Request, Response } from 'express';
import { Logger } from '@core/utils';
import { ErrorResponse, NetworkStatus, SuccessResponse } from '@core/helpers';
import { translate } from '@lib/localization';
import { BooksRepo } from './books.repo';
import { AuthorsRepo } from '@api/authors';
const log = new Logger('CountriesRoutes');


@Router('books')
export class BooksRoutes {
    @Post('/')
    async createBook(req: Request, res: Response) {
        const { name_ar, name_en, rate, image, author_id } = req.body;


        const entityExist = await BooksRepo.entityExist({ name_en });
        if (entityExist) {
            log.debug(`Entity with name ${name_en} is exist`);
            throw new ErrorResponse(translate('entity_exist'), NetworkStatus.BAD_REQUEST);
        }

        const entity = await BooksRepo.createEntity({ name_ar, name_en, rate, image, author_id });
        log.info('New book created');

        const response = new SuccessResponse<{}>(entity, translate('created_success'), NetworkStatus.CREATED);
        res.status(response.code).json(response);
    }

    @Put('/:id')
    async updateBook(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await BooksRepo.fetchEntity({ _id: id });
        if (!entity) {
            log.debug(`Entity with id ${id} is not exist`);
            throw new ErrorResponse(translate('not_exist'), NetworkStatus.BAD_REQUEST);
        }

        const { name_ar, name_en, placeId } = req.body;
        entity.set({ name_ar, name_en, placeId });
        await entity.save();

        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Delete('/:id')
    async deleteBook(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await BooksRepo.deleteEntity({ _id: id });
        if (!entity) {
            log.debug(`Entity with id ${id} is not exist`);
            throw new ErrorResponse(translate('not_exist'), NetworkStatus.BAD_REQUEST);
        }

        const response = new SuccessResponse(null, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/')
    async fetchBooks(req: Request, res: Response) {
        const query = BooksRepo
            .fetchEntities()
            .populate('author_id');
        const entites = await query;
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/:id')
    async fetchBook(req: Request, res: Response) {
        const { id } = req.params;
        const entity = await BooksRepo.fetchEntity({ _id: id }, {}, { lean: true });
        if (!entity) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const response = new SuccessResponse(entity, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    @Get('/author/:author_id')
    async fetchAuthorBooks(req: Request, res: Response) {
        const { author_id } = req.params;
        const entityExist = await AuthorsRepo.entityExist({ _id: author_id });
        log.warn(entityExist);
        if (!entityExist) {
            throw new ErrorResponse(translate('entity_not_found'), NetworkStatus.NOT_ACCEPTABLE);
        }
        const entites = await BooksRepo.fetchEntities({ author_id }, {}, { lean: true });
        const response = new SuccessResponse(entites, translate('success'), NetworkStatus.OK);
        res.status(response.code).json(response);
    }

    authorBooks() { }
}


