import { Constants } from '@core/constants';
import { Responses } from '@core/response';
import { HttpGet, HttpPost, Route, FromQuery } from '@lib/restful';
import { validate } from '@lib/validation';
import { NameValidator } from '@shared/common';
import { CrudRouter, Pagination } from '@shared/crud';
import { identity, tokenService } from '@shared/identity';
import { Request } from 'express';
import Cache from 'file-system-cache';
import { FoldersSchema } from '..';
import sharedFolderService from '../shared-folder/shared-folder.service';
import { FoldersService } from './folders.service';
import { FromHeaders } from '@lib/restful/headers.decorator';

@Route(Constants.Endpoints.FOLDERS, {
    middleware: [identity.isAuthenticated()],
})
export class FoldersRoutes extends CrudRouter<FoldersSchema> {
    private fileSystemCache = Cache({ basePath: './.cache', });

    constructor() {
        super(FoldersService);
    }

    fsCache(key: string, value: any) {
        return this.fileSystemCache.set(key, JSON.stringify(value));
    }

    async fsGetCache(key) {
        const data = await this.fileSystemCache.get(key);
        try {
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    @HttpGet()
    async getAll(@FromQuery(Pagination) pagination: Pagination) {
        const cachedData = await this.fsGetCache('getAll');
        if (cachedData) {
            return cachedData;
        }
        const { data } = await this.service.all({}, pagination);
        await this.fsCache('getAll', data);
        return data;
    }

    @HttpGet('user/shared')
    public async getUserSharedolders(req: Request) {
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const folders = await sharedFolderService.getUserFolders(id, true);
        return new Responses.Ok(folders.data);
    }

    @HttpGet('user')
    public async getUserFolders(@FromHeaders('authorization') authorization: string) {
        const { id } = await tokenService.decodeToken(authorization);
        const folders = await sharedFolderService.getUserFolders(id, false);
        return new Responses.Ok(folders.data);
    }

    @HttpPost('/', validate(NameValidator))
    public async createFolder(req: Request) {
        const { name } = req.body;
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const result = await this.service.create({ name });
        // TODO: it's very important to find a way to pass the current user to service
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        await sharedFolderService.create({
            folder: result.data.id,
            shared: false,
            user: id
        });
        return new Responses.Created(result.data);
    }

    @HttpGet('tags')
    getTags() {
        class Tag {
            static count = -1;
            id = ++Tag.count;
            constructor(
                public color: string = null,
            ) { }
        }
        const tags = [
            new Tag('black'),
            new Tag('blue'),
            new Tag('grey'),
            new Tag('purple'),
            new Tag('red'),
            new Tag('green'),
            new Tag('yellow'),
            new Tag('pink'),
            new Tag('aqua'),
            new Tag('#6c757c'),
        ];
        return new Responses.Ok(tags);
    }
}
