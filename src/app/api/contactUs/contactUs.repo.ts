import { Body } from '@lib/mongoose';
import { ContactUsModel, ContactUsSchema } from './contactUs.model';

export class ContactUsRepo extends ContactUsModel {
    public static async updateEntity(id: string, body: Body<ContactUsSchema>) {
        const entity = await this.fetchEntityById(id).lean();
        if (!entity) {
            return null;
        }
        entity.set(body);
        return entity.save();
    }
    public static createEntity(doc: Body<ContactUsSchema>) {
        const user = new ContactUsRepo(doc);
        return user.save();
    }

    public static fetchEntity(obj, ...args) {
        return this.findOne(obj, ...args);
    }

    public static deleteEntity(id: string) {
        return this.findOneAndDelete({ _id: id });
    }

    public static entityExist(obj) {
        return this.fetchEntity(obj).lean();
    }

    public static fetchEntities(obj?, ...args) {
        return this.find(obj, ...args);
    }

    public static fetchEntityById(id: string) {
        return this.fetchEntity({ _id: id });
    }
}
