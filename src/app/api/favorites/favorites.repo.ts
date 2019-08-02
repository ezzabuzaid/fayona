import { Body } from '@lib/mongoose';
import { FavoritesModel, FavoritesSchema } from './favorites.model';
import { models } from 'mongoose';

type FavoritesModelBody = Body<FavoritesSchema>;

export class FavoritesRepo extends FavoritesModel {

    public static async createEntity(doc: FavoritesModelBody) {
        const entity = new FavoritesRepo(doc);
        const type = doc.type;
        if (!models[type]) {
            return { passed: false, msg: 'is not one of the supported type' }
        }
        const isThere = await models[type].findById(doc.item_id).lean();
        if (!isThere) {
            return { passed: false, msg: 'type is not associated with the item_id' }
        }
        console.warn('passed');
        return { passed: true, entity: entity.save() };
    }

    public static deleteEntity(id: string) {
        return this.findOneAndDelete({ _id: id });
    }

    public static fetchEntities(obj?: Partial<FavoritesModelBody>, ...args) {
        return this.find(obj, ...args);
    }

}
