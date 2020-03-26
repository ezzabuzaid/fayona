import { Router, Post, Get, Delete } from '@lib/methods';
import { Multer } from '@shared/multer';
import { Request, Response } from 'express';
import { sendResponse, Responses, Constants, tokenService } from '@core/helpers';
import { Auth } from '@api/portal';
import { CrudRouter } from '@shared/crud';
import { UploadsSchema } from './uploads.model';
import uploadsService, { UploadsService } from './uploads.service';
import foldersService, { FoldersService } from './folders.service';
import path from 'path';
import { AppUtils, cast } from '@core/utils';
import { IsString, IsMongoId } from 'class-validator';
import { validate } from '@shared/common';
import { FoldersSchema } from './folders.model';

class FilesSearchPayload {
    @IsMongoId()
    @IsString({
        message: 'folder_id_not_valid'
    }) folder: string = null;

    file: string = null;

    constructor(payload: FilesSearchPayload) {
        AppUtils.strictAssign(this, payload);
    }
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

    @Post('/:folder', multer.upload)
    public async uploadFile(req: Request, res: Response) {
        const { folder } = req.params;
        const { file } = req;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        const filePath = path.join(folder, file.filename);
        const result = await uploadsService.create({
            folder,
            user: decodedToken.id,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            path: filePath,
        });
        if (result.hasError) {
            sendResponse(res, new Responses.BadRequest(result.data));
        }
        sendResponse(res, new Responses.Created({
            ...result.data,
            path: filePath
        }));
    }

    @Get(Constants.Endpoints.SEARCH, validate(FilesSearchPayload, 'query'))
    public async searchForFolders(req: Request, res: Response) {
        const payload = cast<FilesSearchPayload>(req.query);
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);
        const files = await this.service.searchForFiles({
            name: payload.file,
            folder: payload.folder,
            user: user_id
        });
        sendResponse(res, new Responses.Ok(files));
    }

}

@Router(Constants.Endpoints.FOLDERS, {
    middleware: [Auth.isAuthenticated],
})
export class FoldersRoutes extends CrudRouter<FoldersSchema, FoldersService> {

    constructor() {
        super(foldersService);
    }

    @Get('/')
    public async getFolders(req: Request, res: Response) {
        // TODO: very important is to find a way to pass the current user to service
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);

        const folders = await foldersService.all({ user: user_id });
        sendResponse(res, new Responses.Ok(folders));
    }

    @Post('/')
    public async createFolder(req: Request, res: Response) {
        // TODO: very important is to find a way to pass the current user to service
        const { name } = req.body;
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);
        if (AppUtils.isEmptyString(name)) {
            throw new Responses.BadRequest('please provide valid name');
        } else {
            const result = await foldersService.create({ name, user: user_id });
            if (AppUtils.not(result.hasError)) {
                return sendResponse(res, new Responses.Created(result.data));
            }
        }
    }
}
