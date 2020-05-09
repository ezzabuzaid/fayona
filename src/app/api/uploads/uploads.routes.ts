import { Router, Post, Get } from '@lib/restful';
import { Multer } from '@shared/multer';
import { Request } from 'express';
import { Responses, Constants } from '@core/helpers';
import { CrudRouter, IReadAllOptions } from '@shared/crud';
import { UploadsSchema } from './uploads.model';
import uploadsService, { UploadsService } from './uploads.service';
import foldersService from './folders/folders.service';
import path from 'path';
import { cast } from '@core/utils';
import { IsMongoId, IsOptional, IsString, IsNumberString } from 'class-validator';
import { validate, NameValidator, isValidId } from '@shared/common';
import sharedFolderService from './shared-folder/shared-folder.service';
import { identity, tokenService } from '@shared/identity';
import { FoldersSchema } from './folders/folders.model';

class FilesSearchPayload implements IReadAllOptions<UploadsSchema> {
    @IsOptional()
    @IsMongoId()
    folder: string = null;
    @IsOptional()
    @IsNumberString()
    tag: string = null;
    @IsOptional()
    @IsString()
    file: string = null;
    @IsOptional()
    @IsNumberString()
    page: number = null;
    @IsOptional()
    @IsNumberString()
    size: number = null;
}

const allowedImageTypes = [
    'image/jpg', 'image/JPG', 'image/jpeg', 'image/JPEG',
    'image/png', 'image/PNG', 'image/gif', 'image/GIF',
    'application/pdf', 'audio/mpeg', 'application/zip'
];

const multer = new Multer({ allowedTypes: allowedImageTypes });
@Router(Constants.Endpoints.UPLOADS, {
    middleware: [identity.isAuthenticated()]
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
        const filePath = `${path.join(id, file.filename)}?name=${file.originalname}&size=${file.size}&type=${file.mimetype}`;
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
    public async searchForFolders(req: Request) {
        const { file, folder, tag, ...options } = cast<FilesSearchPayload>(req.query);
        const { id: user_id } = await tokenService.decodeToken(req.headers.authorization);
        const files = await this.service.searchForFiles({
            folder,
            tag,
            name: file,
            user: user_id
        }, options);
        return new Responses.Ok(files.data);
    }

}
