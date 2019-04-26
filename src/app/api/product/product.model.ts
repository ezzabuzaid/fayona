
import { BaseSchema } from '@core/database';
import { Document, model } from 'mongoose';

import { Logger } from '@core/utils';
const log = new Logger('ProudctModel');

export namespace ProudctType {
    export interface Model extends Document {
        for: string
    }
    export enum FOR {
        MEN = 'men',
        WOMEN = 'women',
        KIDS = 'kids'
    }
    export enum TYPE {
        SHIRT = 'shirt',
        NECK = 'neck',
        SWEET_SHIRT = 'sweetShirt',
        PULLOVER = 'pullover'
    }
    export class Schema extends BaseSchema<Model>{
        static schemaName = 'proudct'
        constructor() {
            super({
                name: {
                    required: true,
                },
                price: {
                    required: true,
                },
                for: {
                    required: true,
                    // maybe for mens and womens 
                    enum: [FOR.MEN, FOR.WOMEN, FOR.KIDS]
                },
                type: {
                    required: true,
                    enum: [TYPE.NECK, TYPE.PULLOVER, TYPE.SHIRT, TYPE.SWEET_SHIRT]
                },
                quality: {
                    name: { required: true },
                    image: { required: true }
                },
                size: {
                    required: true,
                },
                color: {
                    required: true,
                },
                logo: {
                    required: true,
                },
                image: {
                    required: true,
                }
            })
        }
    }
}

export const ProudctModel = model<ProudctType.Model>(ProudctType.Schema.schemaName, new ProudctType.Schema());
