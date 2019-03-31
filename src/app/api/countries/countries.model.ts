
import { BaseSchema } from '@core/database';
import { Document, model } from 'mongoose';

import { Logger } from '@core/utils';
const log = new Logger('CountriesModel');

export namespace CountriesType {
    export interface Model extends Document {
        name_ar: string;
        name_en: string;
        placeId: string;
    }
    export class Schema extends BaseSchema<Model>{
        static schemaName = 'countries'
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
                cities: [{
                    
                }]
            })
        }
    }
}

export const CountriesModel = model<CountriesType.Model>(CountriesType.Schema.schemaName, new CountriesType.Schema());
