
import { Schema, model, Document, Model, SchemaDefinition } from 'mongoose';
import * as bcrypt from "bcryptjs";

import { Types } from 'mongoose';
import { UsersType } from './users.types';

import { Logger } from '../../core/utils/logger.service';
const log = new Logger('Users Model');

let schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });


schema.pre<UsersType.Schema>('save', async function (next) {
    try {
        this.password = await hashPassowrd(this.password);
    } catch (error) {
        throw new Error(error);
    }
});

schema.pre<UsersType.Schema>('update', async function (next) {
    try {
        this.password = await hashPassowrd(this.password);
    } catch (error) {
        throw new Error(error);
    }
});

schema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Cannot hash password');
    }
};

schema.statics.getUser = async function (username: string): Promise<UsersType.Schema> {
    try {
        const user = await UsersModel.findOne({ username });
        return user;
    } catch (error) {
        throw new Error('an error accourd while finding a user');
    }
};

async function hashPassowrd(text) {
    try {
        return await bcrypt.hash(text, 10);
    } catch (error) {
        throw new Error(error);
    }
}

export const schemaName = 'users';
export const UsersModel = model<UsersType.Schema, UsersType.Model>(schemaName, schema);
