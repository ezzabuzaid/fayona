
import { BaseSchema } from '@core/database';
import { Document, model } from 'mongoose';

import { Logger } from '@core/utils';
const log = new Logger('CitiesModel');

export namespace CitiesType {
    export interface Model extends Document {
        name_ar: string;
        name_en: string;
        placeId: string;
    }
    export class Schema extends BaseSchema<Model>{
        static schemaName = 'cities'
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
                }
            })
        }
    }
}

export const CountriesModel = model<CitiesType.Model>(CitiesType.Schema.schemaName, new CitiesType.Schema());
