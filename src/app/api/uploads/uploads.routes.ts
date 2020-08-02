import { Constants } from '@core/constants';
import { Responses } from '@core/response';
import { PrimaryKey } from '@lib/mongoose';
import { ContextRequest, FromParams, FromQuery, HttpGet, HttpPost, Route } from '@lib/restful';
import { FromHeaders } from '@lib/restful/headers.decorator';
import { isValidId } from '@shared/common';
import { CrudRouter, Pagination } from '@shared/crud';
import { identity, tokenService } from '@shared/identity';
import { Multer } from '@shared/multer';
import { IsMongoId, IsNumberString, IsOptional, IsString } from 'class-validator';
import path from 'path';
import { FoldersRoutes } from './folders/folders.routes';
import { UploadsSchema } from './uploads.model';
import { UploadsService } from './uploads.service';

class FilesSearchQuery extends Pagination {
    @IsOptional()
    @IsMongoId()
    folder: string = null;
    @IsOptional()
    @IsNumberString()
    tag: string = null;
    @IsOptional()
    @IsString()
    file: string = null;
}

const allowedImageTypes = [
    'image/jpg', 'image/JPG', 'image/jpeg', 'image/JPEG',
    'image/png', 'image/PNG', 'image/gif', 'image/GIF',
    'application/pdf', 'audio/mpeg', 'application/zip'
];

const multer = new Multer({ allowedTypes: allowedImageTypes });
@Route(Constants.Endpoints.UPLOADS, {
    middleware: [identity.isAuthenticated()],
    children: [FoldersRoutes]
})
export class FileUploadRoutes extends CrudRouter<UploadsSchema, UploadsService> {

    constructor() {
        super(UploadsService);
    }

    @HttpPost(':id', isValidId(), multer.upload)
    public async uploadFile(
        @FromHeaders('authorization') authorization: string,
        @FromParams('id') id: PrimaryKey,
        @ContextRequest() request
    ) {
        const { file } = request;
        const decodedToken = await tokenService.decodeToken(authorization);
        const filePath = `${ path.join(id as any, file.filename) }?name=${ file.originalname }&size=${ file.size }&type=${ file.mimetype }`;
        const result = await this.service.create({
            folder: id,
            user: decodedToken.id,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            path: filePath,
        });
        return new Responses.Created(result.data);
    }

    @HttpGet(Constants.Endpoints.SEARCH)
    public async searchForFolders(
        @FromHeaders('authorization') authorization: string,
        @FromQuery(FilesSearchQuery) query: FilesSearchQuery
    ) {
        const { file, folder, tag, ...options } = query;
        const { id: user_id } = await tokenService.decodeToken(authorization);
        const files = await this.service.searchForFiles({
            folder,
            tag,
            name: file,
            user: user_id
        }, options);
        return new Responses.Ok(files.data);
    }

}
