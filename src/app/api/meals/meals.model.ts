import { BaseModel, Entity, Field } from '@lib/mongoose';

@Entity('meals')
export class MealsSchema {
    @Field() public name: string;
    @Field() public recipe: string;
    @Field() public image: string;
    @Field() public price: number;
    @Field() public menu_id: number;
}

export const MealsModel = BaseModel<MealsSchema>(MealsSchema);
