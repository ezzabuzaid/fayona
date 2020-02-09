import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

export class GroupMemberSchema {
    @Field() public user_id: Types.ObjectId;
    @Field({ default: false }) public isAdmin: boolean;
}

@Entity(Constants.Schemas.GROUPS)
export class GroupsSchema {
    @Field() public title: string;
    @Field() public logo: string;
    @Field() public users: GroupMemberSchema[];
}

export default BaseModel(GroupsSchema);
