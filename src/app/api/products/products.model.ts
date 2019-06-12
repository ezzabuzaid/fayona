import { Logger } from '@core/utils';
import { BaseModel, Entity, Field } from '@lib/mongoose';
const log = new Logger('ProductsSchema');

export enum PROUDCT_FOR {
    MEN = 'MEN',
    WOMEN = 'WOMEN',
    KIDS = 'KIDS'
}
export enum PROUDCT_STYLE    {
    SHIRT = 'SHIRT',
    NECK = 'NECK',
    SWEET_SHIRT = 'SWEET_SHIRT',
    PULLOVER = 'PULLOVER'
}

@Entity('products')
export class ProductsSchema {

    @Field() public status: string;
    @Field() public price: number;
    @Field() public description: string;
    @Field() public image: string;
    @Field() public color: string;
    @Field() public size: string;
    @Field({ enum: [PROUDCT_FOR.MEN, PROUDCT_FOR.WOMEN, PROUDCT_FOR.KIDS] }) public for: string;
    @Field({
        enum: [PROUDCT_STYLE.NECK, PROUDCT_STYLE.PULLOVER, PROUDCT_STYLE.SHIRT, PROUDCT_STYLE.SWEET_SHIRT]
    }) public style: number;
}

export const ProductsModel = BaseModel<ProductsSchema>(ProductsSchema);

const x = Object.keys(PROUDCT_FOR);
console.log(x);
