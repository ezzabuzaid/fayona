
import { Logger } from '../../core/utils/logger.service';
import { BaseSchema } from '@core/database';
import { Document, model, Model } from 'mongoose';
import { UsersRepo } from './users.repo';

const log = new Logger('Users Model');

const schema = new BaseSchema<UsersType.Model>(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
);

export namespace UsersType {
    export interface Model extends Document {
        username: string;
        password: string;
        /**
         * 
         * @param candidatePassword which wanna to compare with the current password
         */
        comparePassword(candidatePassword: string): Promise<boolean>;
    }

}
export const schemaName = 'users';
export const UsersModel = model<UsersType.Model>(schemaName, schema);

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