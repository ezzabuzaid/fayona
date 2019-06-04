import { CitiesModel, CitiesType } from './cities.model';

export class CitiesRepo extends CitiesModel {

    public static async entityExist(obj: Partial<CitiesType.Model>) {
        return this.fetchEntity(obj, {}, { lean: true });
    }

    public static createEntity(obj: CitiesType.Model) {
        return (new CitiesRepo(obj)).save();
    }

    public static fetchEntities(obj: Partial<CitiesType.Model> = {}) {
        return this.find(obj);
    }

    public static fetchEntity(obj: Partial<CitiesType.Model>, ...args) {
        return this.findOne(obj, ...args);
    }

    public static deleteEntity(obj: Partial<CitiesType.Model>) {
        // obj must be of type user
        return this.findOneAndDelete(obj);
    }
}
