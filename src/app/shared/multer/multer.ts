import multer = require('multer');
import path = require('path');
import assert = require('assert');

import { AppUtils, Parameter, cast } from '@core/utils';
import { Request, NextFunction, Response } from 'express';
import { Responses, ErrorResponse } from '@core/helpers';
import { Types } from 'mongoose';
import foldersService from '@api/uploads/folders/folders.service';
import { UploadsHelper } from '@api/uploads/uploads.helper';

export class UploadOptions {
    public allowedTypes: string[] = [];

    /**
     * number in kilobytes
     */
    public maxSize: number = 1024 * 5;
    public maxFilesNumber: number = 1;
    public fieldName: string = 'upload';
}

export class Multer {

    private multer: ReturnType<typeof multer>;
    constructor(public options: Partial<UploadOptions> = {}) {
        this.options = Object.assign({}, new UploadOptions(), this.options);
        assert(this.options.maxFilesNumber >= 1, 'Multer maxFilesNumber should be at least one');
        assert(AppUtils.hasItemWithin(this.options.allowedTypes), 'Multer allowedTypes should at least has one allowed type');
        this.multer = multer(this.defaultOptions());
        this.upload = this.upload.bind(this);
    }

    public async upload(req: Request, res: Response, next: NextFunction) {
        if (this.options.maxFilesNumber === 1) {
            this.multer.single(this.options.fieldName)(req, res, next);
        } else {
            this.multer.array(this.options.fieldName, this.options.maxFilesNumber)(req, res, next);
        }
    }

    public defaultOptions(): Parameter<typeof multer> {
        return {
            storage: this.storage,
            fileFilter: this.fileFilter.bind(this),
            limits: {
                fileSize: 1024 * this.options.maxSize,
                files: this.options.maxFilesNumber
            },
        };
    }

    private get storage() {
        const formatFileName = (file: Express.Multer.File) => `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        return multer.diskStorage({
            destination: async (
                req: Request,
                file: Express.Multer.File,
                callback: (error: ErrorResponse, dest: string) => void
            ) => {
                const { folder } = cast(req.params);

                if (folder !== 'others') {
                    if (Types.ObjectId.isValid(folder)) {
                        const folderExistance = await foldersService.exists({ _id: folder });
                        if (folderExistance.hasError) {
                            callback(new Responses.BadRequest(folderExistance.data), null);
                        }
                    } else {
                        callback(new Responses.BadRequest('folder_id_not_valid'), null);
                    }
                }
                UploadsHelper.createFolderDirectory(folder);
                callback(null, UploadsHelper.folderPath(folder));
            },
            filename(req: Express.Request, file, cb) {
                cb(null, formatFileName(file));
            }
        });
    }

    private fileFilter(req: Express.Request, file: Express.Multer.File, cb) {
        const type = file.mimetype;
        const isAllowedType = this.options.allowedTypes.some((allowedType) => allowedType === type);
        if (AppUtils.isFalsy(isAllowedType)) {
            cb(new Responses.BadRequest(`Type ${type} not allowed`));
        } else {
            cb(null, true);
        }
    }

}
