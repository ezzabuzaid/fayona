import { BaseSchema } from '@core/database';
import { Document, model } from 'mongoose';

import { Validation } from '@shared/common';

import { Logger } from '@core/utils';
const log = new Logger('Users Model');
export namespace UsersType {
    export interface Model extends Document {
        username: string;
        password: string;
        email: string;
        /**
         * 
         * @param candidatePassword which wanna to compare with the current password
         */
        comparePassword(candidatePassword: string): Promise<boolean>;
    }
    export class Schema extends BaseSchema<Model>{
        static schemaName = 'users'
        constructor() {
            super({
                username: {
                    type: String,
                    required: true,
                    unique: true,
                    lowercase: true,
                    trim: true
                },
                email: {
                    type: String,
                    required: true,
                    unique: true,
                    match: [Validation.EmailValidation, 'Please provide a valid email address']
                },
                password: {
                    type: String,
                    required: true,
                    trim: true
                },
            })
        }
    }
}

export const UsersModel = model<UsersType.Model>(UsersType.Schema.schemaName, new UsersType.Schema());

// export const UsersModel = function <T extends Document>() { return model<T>(schemaName, schema); };
// A repo used to talk to other module
// A repo will act as the base component
// Will have the functionality that needed for the router

// extend schema instead of Typegoose
// make the decorator for porp, methods, statics, virtuals(deffer it)
// class Job {
//     @prop()
//     title?: string;

//     @prop()
//     position?: string;
//   }

//   class Car extends Typegoose {
//     @prop()
//     model?: string;
//   }

// class User extends Typegoose { 
//     @prop()
//     name?: string;

//     @prop({ required: true })
//     age: number;

//     @prop()
//     job?: Job;

//     @prop({ ref: Car, required: true })
//     car: Ref<Car>;
//   }