export interface Crud<T> {

    //     static async entityExist(obj: Partial<CitiesType.Model>) {
    //     return this.fetchEntity(obj, {}, { lean: true });
    // }

    //     static createEntity(obj: CitiesType.Model) {
    //     return (new CitiesRepo(obj)).save()
    // }

    //     static fetchEntities(obj: Partial < CitiesType.Model > = {}) {
    //     return this.find(obj);
    // }

    //     static fetchEntity(obj: Partial < CitiesType.Model >, ...args) {
    //     return this.findOne(obj, ...args);
    // }

    deleteEntity: (obj: Partial<T>) => Promise<T>
}
