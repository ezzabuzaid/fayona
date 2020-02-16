import { Router, Post } from '@lib/methods';
import { Multer } from '@shared/multer';
import { Request, Response, NextFunction } from 'express';
import { sendResponse, Responses, Constants } from '@core/helpers';
import { Auth } from '@api/portal';

const allowedImageTypes = [
    'image/jpg', 'image/JPG', 'image/jpeg', 'image/JPEG',
    'image/png', 'image/PNG', 'image/gif', 'image/GIF'
];

const multer = new Multer({ allowedTypes: allowedImageTypes });
@Router(Constants.Endpoints.UPLOADS)
export class FileUploadRoutes {

    @Post('/:category/:kind', Auth.isAuthenticated, multer.upload)
    public async uploadFile(req: Request, res: Response, next: NextFunction) {
        console.log(req.params);
        sendResponse(res, new Responses.Created(req.file.filename));
    }
}
