import { AuthorsModel } from './authors.model';

export class AuthorsRepo extends AuthorsModel {

    static entityExist(obj: Partial<AuthorsModel>) {
        return this.fetchEntity(obj, {}, { lean: true });
    }

    static createEntity(obj: Partial<AuthorsModel>) {
        return (new AuthorsModel(obj)).save()
    }

    static fetchEntities(obj: Partial<AuthorsModel> = {}) {
        return this.find(obj);
    }

    static fetchEntity(obj: Partial<AuthorsModel>, ...args) {
        return this.findOne(obj, ...args);
    }

    static deleteEntity(obj: Partial<AuthorsModel>) {
        return this.findOneAndDelete(obj);
    }
}

