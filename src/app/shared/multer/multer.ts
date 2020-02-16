import multer = require('multer');
import path = require('path');
import fileSystem = require('fs');
import assert = require('assert');

import { AppUtils, Parameter } from '@core/utils';
import { Request, NextFunction, Response } from 'express';
import { Responses, ErrorResponse } from '@core/helpers';

class UploadFileDto {
    category: string;
    kind: string;
    [key: string]: string;
}

export class UploadOptions {
    allowedTypes: string[] = [];
    /**
     * number in kilobytes  
     *  */
    maxSize: number = 1024 * 5;
    maxFilesNumber: number = 1;
    fieldName: string = 'upload';
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

    async upload(req: Request, res: Response, next: NextFunction) {
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
        const fileName = (file: Express.Multer.File) => `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        return multer.diskStorage({
            destination: (req: Request<UploadFileDto>, file: Express.Multer.File, callback: (error: ErrorResponse, dest: string) => void) => {
                const { category, kind } = req.params;
                if (AppUtils.isEmptyString(category)) {
                    callback(new Responses.BadRequest('please provide valid category name'), null);
                } else if (AppUtils.isEmptyString(kind)) {
                    callback(new Responses.BadRequest('please provide valid kind id'), null);
                } else {
                    const uploadFile = path.join(process.cwd(), '../', 'uploads', category, kind);
                    fileSystem.mkdirSync(uploadFile, { recursive: true });
                    callback(null, uploadFile);
                }
            },
            filename(req: Express.Request, file, cb) {
                cb(null, fileName(file));
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
