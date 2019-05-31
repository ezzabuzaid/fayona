// import { BooksModel } from './books.model';

// export class BooksRepo extends BooksModel {

//     static entityExist(obj: Partial<BooksModel>) {
//         return this.fetchEntity(obj, {}, { lean: true });
//     }

//     static createEntity(obj: Partial<BooksModel>) {
//         return (new BooksModel(obj)).save()
//     }

//     static fetchEntities(obj: Partial<BooksModel> = {}, ...args) {
//         return this.find(obj, ...args);
//     }

//     static fetchEntity(obj: Partial<BooksModel>, ...args) {
//         return this.findOne(obj, ...args);
//     }

//     static deleteEntity(obj: Partial<BooksModel>) {
//         return this.findOneAndDelete(obj);
//     }
// }

