import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Types } from 'mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.meals)
export class MealsSchema {
    @Field() public name: string;
    @Field() public recipe: string;
    @Field() public image: string;
    @Field() public price: number;
    @Field({ required: false, default: 0 }) public rate: number;
    @Field({ ref: Constants.Schemas.MENUS }) public menu_id: Types.ObjectId;
}

export const MealsModel = BaseModel<MealsSchema>(MealsSchema);
