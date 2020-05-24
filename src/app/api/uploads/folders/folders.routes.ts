import { Constants } from '@core/helpers';
import { identity, tokenService } from '@shared/identity';
import { CrudRouter } from '@shared/crud';
import { FoldersSchema } from '..';
import foldersService from './folders.service';
import { Get, Post, Router } from '@lib/restful';
import sharedFolderService from '../shared-folder/shared-folder.service';
import { NameValidator, validate } from '@shared/common';
import { Request } from 'express';
import { Responses } from '@core/response';

@Router(Constants.Endpoints.FOLDERS, {
    middleware: [identity.isAuthenticated()],
})
export class FoldersRoutes extends CrudRouter<FoldersSchema> {
    constructor() {
        super(foldersService);
    }

    @Get('user/shared')
    public async getUserSharedolders(req: Request) {
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const folders = await sharedFolderService.getUserFolders(id, true);
        return new Responses.Ok(folders.data);
    }

    @Get('user')
    public async getUserFolders(req: Request) {
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const folders = await sharedFolderService.getUserFolders(id, false);
        return new Responses.Ok(folders.data);
    }

    @Post('/', validate(NameValidator))
    public async createFolder(req: Request) {
        const { name } = req.body;
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const result = await foldersService.create({ name });
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

    @Get('tags')
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
