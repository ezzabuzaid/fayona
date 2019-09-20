import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.MENUS)
export class MenusSchema {
    @Field() public name: string;
    @Field() public description: string;
    @Field() public image: string;
}

export const MenusModel = BaseModel<MenusSchema>(MenusSchema);
