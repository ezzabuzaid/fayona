import { Field, Entity, BaseModel } from '@lib/mongoose';
import { Types } from 'mongoose';

@Entity('activities')
export class ActivitesSchema {
    @Field() public oldValue: string;
    @Field() public newValue: string;
    @Field() public user: Types.ObjectId;
    @Field() public field: string;
}

export const ActivitesModel = BaseModel(ActivitesSchema);
