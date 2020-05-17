import multer = require('multer');
import path = require('path');
import assert = require('assert');

import { AppUtils, Parameter, cast } from '@core/utils';
import { Request, NextFunction, Response } from 'express';
import { Responses, ErrorResponse } from '@core/helpers';
import { Types } from 'mongoose';
import foldersService from '@api/uploads/folders/folders.service';
import { Directories } from '@shared/common';

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

    public upload(req: Request, res: Response, next: NextFunction) {
        if (this.options.maxFilesNumber === 1) {
            return this.multer.single(this.options.fieldName);
        } else {
            return this.multer.array(this.options.fieldName, this.options.maxFilesNumber);
        }
    }

    public defaultOptions(): Parameter<typeof multer> {
        return {
            storage: this.storage,
            fileFilter: (req, file, callback) => this.fileFilter(file, callback),
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
                const { id: folder } = cast(req.params);

                if (folder !== 'others') {
                    if (Types.ObjectId.isValid(folder)) {
                        const folderExistance = await foldersService.exists({ _id: folder });
                        if (folderExistance.hasError) {
                            callback(new Responses.BadRequest(String(folderExistance.data)), null);
                        }
                    } else {
                        callback(new Responses.BadRequest('folder_id_not_valid'), null);
                    }
                }
                Directories.createFolderDirectory(folder);
                callback(null, Directories.folderPath(folder));
            },
            filename(req: Express.Request, file, cb) {
                cb(null, formatFileName(file));
            }
        });
    }

    private fileFilter(file: Express.Multer.File, callback) {
        const type = file.mimetype.toLowerCase();
        const isAllowedType = this.options.allowedTypes.some((allowedType) => allowedType.toLowerCase() === type);
        if (AppUtils.isFalsy(isAllowedType)) {
            callback(new Responses.BadRequest(`Type ${type} not allowed`));
        } else {
            callback(null, true);
        }
    }

}
