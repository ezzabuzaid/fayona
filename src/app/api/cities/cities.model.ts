
import { BaseSchema } from '@core/database';
import { Document, model } from 'mongoose';

import { Logger } from '@core/utils';
const log = new Logger('CitiesModel');

export namespace CitiesType {
    export interface IModel extends Document {
        name_ar: string;
        name_en: string;
        placeId: string;
        countryId: string;
    }
    export class Schema extends BaseSchema<IModel> {
        public static schemaName = 'cities';
        constructor() {
            super({
                name_ar: {
                    type: String,
                    required: true,
                    unique: true,
                    lowercase: true,
                    trim: true
                },
                name_en: {
                    type: String,
                    required: true,
                    unique: true,
                    lowercase: true,
                    trim: true
                },
                placeId: {
                    type: String,
                    required: true,
                    unique: true
                },
                countryId: {
                    type: BaseSchema.Types.ObjectId,
                    required: true
                },
            });
        }
    }
}

export const CitiesModel = model<CitiesType.IModel>(CitiesType.Schema.schemaName, new CitiesType.Schema());
