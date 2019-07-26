import { Body } from '@lib/mongoose';
import { UsersModel, UsersSchema } from './users.model';

export class UsersRepo extends UsersModel {
    public static async updateEntity(id, doc: Body<UsersSchema>) {
        const entity = await this.fetchEntityById(id).lean();
        if (!entity) {
            return null;
        }
        entity.set(doc);
        await entity.save();
    }
    public static async createEntity(doc: Body<UsersSchema>) {

        const checkUsername = await this.entityExist({ username: doc.username });
        if (checkUsername) {
            return null;
        }

        const checkEmail = await this.entityExist({ email: doc.email });
        if (checkEmail) {
            return null;
        }

        const user = new UsersRepo(doc);
        await user.hashUserPassword();
        return user.save();
    }

    public static fetchEntity(obj: Partial<Body<UsersSchema>>, ...args) {
        return this.findOne(obj, ...args);
    }

    public static deleteEntity(id: string) {
        return this.findOneAndDelete({ _id: id });
    }

    public static entityExist(obj: Partial<Body<UsersSchema>>) {
        return this.fetchEntity(obj).lean();
    }

    public static fetchEntities(obj?, ...args) {
        return this.find(obj, ...args);
    }

    public static fetchEntityById(id: string) {
        return this.findById(id);
    }
}
