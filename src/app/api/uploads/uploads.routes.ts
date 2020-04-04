import { Router, Post, Get } from '@lib/methods';
import { Multer } from '@shared/multer';
import { Request, Response } from 'express';
import { Responses, Constants, tokenService } from '@core/helpers';
import { Auth } from '@api/portal';
import { CrudRouter } from '@shared/crud';
import { UploadsSchema } from './uploads.model';
import uploadsService, { UploadsService } from './uploads.service';
import foldersService, { FoldersService } from './folders/folders.service';
import path from 'path';
import { cast } from '@core/utils';
import { IsString, IsMongoId } from 'class-validator';
import { validate, NameValidator, isValidId } from '@shared/common';
import { FoldersSchema } from './folders/folders.model';
import sharedFolderService from './shared-folder/shared-folder.service';

class FilesSearchPayload {
    @IsMongoId()
    @IsString({
        message: 'folder_id_not_valid'
    }) folder: string = null;
    file: string = null;
    tag: string = null;
}

const allowedImageTypes = [
    'image/jpg', 'image/JPG', 'image/jpeg', 'image/JPEG',
    'image/png', 'image/PNG', 'image/gif', 'image/GIF',
    'application/pdf'
];

const multer = new Multer({ allowedTypes: allowedImageTypes });
@Router(Constants.Endpoints.UPLOADS, {
    middleware: [Auth.isAuthenticated]
})
export class FileUploadRoutes extends CrudRouter<UploadsSchema, UploadsService> {

    constructor() {
        super(uploadsService);
    }

    @Post('/:id', isValidId(), multer.upload)
    public async uploadFile(req: Request) {
        const { id } = cast(req.params);
        const { file } = req;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const filePath = path.join(id, file.filename);
        const result = await uploadsService.create({
            folder: id,
            user: decodedToken.id,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            path: filePath,
        });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Created({
            ...result.data,
            path: filePath
        });
    }

    @Get(Constants.Endpoints.SEARCH, validate(FilesSearchPayload, 'query'))
    public async searchForFolders(req: Request, res: Response) {
        const payload = cast<FilesSearchPayload>(req.query);
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);
        const files = await this.service.searchForFiles({
            name: payload.file,
            folder: payload.folder,
            tag: payload.tag,
            user: user_id
        });
        return new Responses.Ok(files);
    }

}

@Router(Constants.Endpoints.FOLDERS, {
    middleware: [Auth.isAuthenticated],
})
export class FoldersRoutes extends CrudRouter<FoldersSchema, FoldersService> {

    constructor() {
        super(foldersService);
    }

    @Get('user')
    public async getUserFolders(req: Request, res: Response) {
        // TODO: very important is to find a way to pass the current user to service
        const { id } = await tokenService.decodeToken(req.headers.authorization);

        // const folders = await foldersService.all();
        const folders = await sharedFolderService.all(
            {
                user: id,
                shared: true
            },
        );
        return new Responses.Ok(folders.data);
    }

    @Post('/', validate(NameValidator))
    public async createFolder(req: Request, res: Response) {
        const { name } = req.body;
        const { id } = await tokenService.decodeToken(req.headers.authorization);
        const result = await foldersService.create({ name });
        // TODO: it's very important to find a way to pass the current user to service
        await sharedFolderService.create({
            folder: result.data.id,
            shared: false,
            user: id
        });
        if (result.hasError) {
            return new Responses.BadRequest(result.message);
        }
        return new Responses.Created(result.data);
    }

    @Get('tags')
    getTags() {
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
            new Tag('azure'),
        ];
        return new Responses.Ok(tags);
    }
}

class Tag {
    static count = -1;
    id = ++Tag.count;
    constructor(
        public color: string = null,
    ) { }
}
