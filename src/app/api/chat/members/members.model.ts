import { Entity, Field, BaseModel, ForeignKey } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.MEMBERS)
export class GroupMemberSchema {
    @Field({ required: true, ref: Constants.Schemas.USERS }) public user: ForeignKey = null;
    @Field() public isAdmin: boolean = false;
    @Field({ ref: Constants.Schemas.ROOMS, required: true }) public room: ForeignKey;
}
export default BaseModel(GroupMemberSchema);
