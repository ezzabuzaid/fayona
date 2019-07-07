import { BaseModel, Entity, Field } from '@lib/mongoose';

@Entity('menus')
export class MenusSchema {
    @Field() public name: string;
    @Field() public description: string;
    @Field() public image: string;
}

export const MenusModel = BaseModel<MenusSchema>(MenusSchema);
