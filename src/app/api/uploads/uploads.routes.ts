import { Router, Post, Get } from '@lib/methods';
import { Multer } from '@shared/multer';
import { Request, Response } from 'express';
import { sendResponse, Responses, Constants, tokenService } from '@core/helpers';
import { Auth } from '@api/portal';
import { CrudRouter } from '@shared/crud';
import { UploadsSchema } from './uploads.model';
import uploadsService, { UploadsService } from './uploads.service';
import foldersService from './folders.service';
import path from 'path';
import { AppUtils } from '@core/utils';
import { IsString, IsMongoId } from 'class-validator';
import { validatePayload } from '@shared/common';

const allowedImageTypes = [
    'image/jpg', 'image/JPG', 'image/jpeg', 'image/JPEG',
    'image/png', 'image/PNG', 'image/gif', 'image/GIF'
];

const multer = new Multer({ allowedTypes: allowedImageTypes });
@Router(Constants.Endpoints.UPLOADS)
export class FileUploadRoutes extends CrudRouter<UploadsSchema, UploadsService> {

    constructor() {
        super(uploadsService);
    }

    @Post('folders', Auth.isAuthenticated)
    public async createFolder(req: Request, res: Response) {
        const { name } = req.body;
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);
        if (AppUtils.not(AppUtils.isEmptyString(name))) {
            const result = await foldersService.create({ name, user: user_id });
            if (AppUtils.not(result.hasError)) {
                return sendResponse(res, new Responses.Created(result.data));
            }
        }
        throw new Responses.BadRequest('please provide valid name');
    }

    @Post('/:folder', Auth.isAuthenticated, multer.upload)
    public async uploadFile(req: Request, res: Response) {
        const { folder } = req.params;
        const { file } = req;
        const decodedToken = await tokenService.decodeToken(req.headers.authorization);
        await uploadsService.create({
            folder,
            user: decodedToken.id,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            path: path.join(folder, file.filename),
        });
        sendResponse(res, new Responses.Created(`${req.params.folder}/${req.file.filename}`));
    }

    @Get('folders')
    public async getFolders(req: Request, res: Response) {
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);

        const folders = await foldersService.all({ user: user_id });
        sendResponse(res, new Responses.Ok(folders));
    }

    @Get('search', Auth.isAuthenticated)
    public async searchForUsers(req: Request, res: Response) {
        const payload = new FilesSearchPayload(req.query);
        await validatePayload(payload);
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);
        const files = await this.service.searchForFiles({
            name: payload.file,
            folder: payload.folder,
            user: user_id
        });
        sendResponse(res, new Responses.Ok(files));
    }

}

class FilesSearchPayload {
    @IsMongoId()
    @IsString({
        message: 'you cannot filter without a folder, please make sure to include the folder name'
    }) folder: string = null;

    file: string = null;

    constructor(payload: FilesSearchPayload) {
        AppUtils.strictAssign(this, payload);
    }
}
