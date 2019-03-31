import { CountriesModel, CitiesType } from './cities.model';

export class CitiesRepo extends CountriesModel {

    static async entityExist(obj: Partial<CitiesType.Model>) {
        return this.fetchEntity(obj, {}, { lean: true });
    }

    static createEntity(obj: CitiesType.Model) {
        return (new CitiesRepo(obj)).save()
    }

    static fetchEntities(obj: Partial<CitiesType.Model> = {}) {
        return this.find(obj);
    }

    static fetchEntity(obj: Partial<CitiesType.Model>, ...args) {
        return this.findOne(obj, ...args);
    }

    static deleteEntity(obj: Partial<CitiesType.Model>) {
        // obj must be of type user
        return this.findOneAndDelete(obj);
    }
}

