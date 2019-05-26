import multer = require('multer');
import { AppUtils, Parameter } from '@core/utils';
import path = require('path');
import { Request } from 'express';
import { BooksRepo } from '@api/books/books.repo';
import { AuthorsRepo } from '@api/authors/authors.repo';
import { ErrorResponse } from '@core/helpers/response.model';
import { NetworkStatus } from '../../core/helpers/network-status';

const upload = multer();
const _Multer = AppUtils.getTypeOf<typeof upload>(multer);

type MulterParams = Parameter<typeof multer>;
export class Multer extends _Multer {
    private allowedTypes = [BooksRepo.modelName, AuthorsRepo.modelName];
    constructor(options: MulterParams = {}) {
        super((() => this.options(options))());
    }

    options(opts: MulterParams): MulterParams {
        return {
            storage: opts.storage || this.storage,
            fileFilter: opts.fileFilter || this.fileFilter,
            limits: {
                fileSize: 1024 * 1024 * 5,
                ...opts.limits
            },
        }
    }

    private get storage() {
        return multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: (error, dest) => void) => {
                const { type = '' } = req.body;
                if (!this.allowedTypes.some(_type => _type === type)) {
                    throw new ErrorResponse(`this type ${type} is not allowed`, NetworkStatus.NOT_ACCEPTABLE);
                }
                // REVIEW e.g books/id
                // the file will be saved under the books folder into id folder
                // this mean each entity will have it's own file
                // so when you delete an entity you'll find that easy to delete it's file
                // be aware to read about atomic transaction to make sure not to delete the enitiy images or the enity itself without the completion of the proccess 
                cb(null, path.join(process.cwd(), `uploads`, type));
            },
            filename(req: Express.Request, file, cb) {
                const name = `${file.fieldname}-${Date.now()}-${file.originalname}`;
                file['name'] = name;
                cb(null, name);
            }
        });
    }

    private fileFilter(req: Express.Request, file: Express.Multer.File, cb) {
        const type = file.mimetype;
        if (type === 'image/jpeg' || type === 'image/png') {
            cb(null, true);
        } else {
            // TODO throw an error instead
            throw new ErrorResponse(`this type ${type} is not allowed`, NetworkStatus.NOT_ACCEPTABLE);
            // cb(null, false);
        }
    }

}

// REVIEW  From this class you can create an instance for pdf upload, word, pictures ...etx

