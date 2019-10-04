import { Body } from '@lib/mongoose';
import { FavoritesModel, FavoritesSchema } from './favorites.model';
import { models } from 'mongoose';

type FavoritesBody = Body<FavoritesSchema>;

export class FavoritesRepo {
    private static model = FavoritesModel;

    public static async createEntity(doc: FavoritesBody) {
        const oldEntity = await this.model.findOne({ item_id: doc.item_id }).lean();
        if (!oldEntity) {
            const entity = new this.model(doc);
            const type = doc.type;
            if (!models[type]) {
                return { passed: false, msg: 'is not one of the supported type' };
            }
            const isThere = await models[type].findById(doc.item_id).lean();
            if (!isThere) {
                return { passed: false, msg: 'type is not associated with the item_id' };
            }
            return { passed: true, entity: await entity.save() };
        } else {
            return { passed: false, msg: 'entity is already assigned as favorites' };
        }
    }

    public static deleteEntity(id: string) {
        return this.model.findOneAndDelete({ _id: id });
    }

    public static fetchEntities(obj?: Partial<FavoritesBody>, ...args) {
        return this.model.find(obj, ...args);
    }

}
