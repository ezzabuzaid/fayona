import { Logger } from '@core/utils';
import { ProductsModel, ProductsSchema } from './products.model';
const log = new Logger('AdminRepo');

export class ProductsRepo extends ProductsModel {
    public static async createEntity(doc: Partial<ProductsSchema>) {
        const user = new ProductsRepo(doc);
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
