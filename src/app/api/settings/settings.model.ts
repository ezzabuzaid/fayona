import { Entity, Field } from '@lib/mongoose';

@Entity('settings')
export class SettingSchema {
    @Field() settings = {};
}
