import { Body } from '@lib/mongoose';
import { AccountModel, AccountSchema } from './accounts.model';
import { Repo } from '@shared/crud/crud.repo';

export class AccountRepo {
    private static model = AccountModel;
    public static async updateEntity(id: string, body: Body<AccountSchema>) {
        const entity = await this.fetchEntityById(id).lean();
        if (!entity) {
            return null;
        }
        entity.set(body);
        return entity.save();
    }
    public static create(doc: Partial<Body<AccountSchema>>) {
        const user = new this.model(doc);
        return user.save();
    }

    public static fetchEntity(obj: Partial<Body<AccountSchema>>, ...args) {
        return this.model.findOne(obj, ...args);
    }

    public static delete(user_id) {
        return this.model.findOneAndDelete({ user_id });
    }

    public static entityExist(obj) {
        return this.fetchEntity(obj).lean();
    }

    public static fetchEntities(obj?, ...args) {
        return this.model.find(obj, ...args).populate('user_id');
    }

    public static fetchEntityById(id: string) {
        return this.model.findById(id);
    }
}
