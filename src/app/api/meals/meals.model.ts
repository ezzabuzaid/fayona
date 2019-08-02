import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Types } from 'mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.meals)
export class MealsSchema {
    @Field() public name: string;
    @Field() public recipe: string;
    @Field() public image: string;
    @Field() public price: number;
    @Field() public menu_id: Types.ObjectId;
}

export const MealsModel = BaseModel<MealsSchema>(MealsSchema);
