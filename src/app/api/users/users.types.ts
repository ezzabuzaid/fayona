import * as  mongoose from "mongoose";

export namespace UsersType {

    export interface Schema extends mongoose.Document {
        username: string;
        password: string;
        comparePassword: (candidatePassword: string) => Promise<boolean>;
    }

    export interface Model extends mongoose.Model<Schema> {
        getUser: (username: string) => Schema;
    }

}
