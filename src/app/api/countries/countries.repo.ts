import { CountriesModel, CountriesType } from './countries.model';
import { UsersType } from '@api/users';
import { Mongoose } from 'mongoose';

export class CountriesRepo extends CountriesModel {

    static async entityExist(obj: Partial<CountriesType.Model>) {
        return this.fetchEntity(obj, {}, { lean: true });
    }

    static createEntity(obj: CountriesType.Model) {
        return (new CountriesRepo(obj)).save()
    }

    static fetchEntities(obj: Partial<CountriesType.Model> = {}) {
        return this.find(obj);
    }

    static fetchEntity(obj: Partial<CountriesType.Model>, ...args) {
        return this.findOne(obj, ...args);
    }

    static deleteEntity(obj: Partial<CountriesType.Model>) {
        // obj must be of type user
        return this.findOneAndDelete(obj);
    }
}

