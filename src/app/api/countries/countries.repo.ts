import { CountriesModel } from './countries.model';

export class CountriesRepo extends CountriesModel {

    static entityExist(obj: Partial<CountriesModel>) {
        return this.fetchEntity(obj, {}, { lean: true });
    }

    static createEntity(obj: Partial<CountriesModel>) {
        return (new CountriesModel(obj)).save()
    }

    static fetchEntities(obj: Partial<CountriesModel> = {}) {
        return this.find(obj);
    }

    static fetchEntity(obj: Partial<CountriesModel>, ...args) {
        return this.findOne(obj, ...args);
    }

    static deleteEntity(obj: Partial<CountriesModel>) {
        // obj must be of type user
        return this.findOneAndDelete(obj);
    }
}

