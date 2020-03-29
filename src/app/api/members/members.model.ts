import { Entity, Field, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.MEMBERS)
export class GroupMemberSchema {
    @Field({ required: true, ref: Constants.Schemas.USERS }) public user: Types.ObjectId = null;
    @Field() public isAdmin: boolean = false;
    @Field({ ref: Constants.Schemas.GROUPS, required: true }) public group: Types.ObjectId;
}
export default BaseModel(GroupMemberSchema);
