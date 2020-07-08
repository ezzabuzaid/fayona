import { Field, BaseModel, Entity } from '@lib/mongoose';

@Entity('settings')
export class SettingSchema {
    @Field() settings = {};
}

