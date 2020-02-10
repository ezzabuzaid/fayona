import { BaseModel, Entity, Field, Body } from '@lib/mongoose';
import { Constants } from '@core/helpers';

export class GroupMemberSchema {
    @Field({ pure: true, required: true }) public user_id: string;
    @Field() public isAdmin: boolean = false;
}

@Entity(Constants.Schemas.GROUPS)
export class GroupsSchema {

    constructor(dto: Body<GroupsSchema>) {
        this.title = dto.title;
        this.logo = dto.logo;
        this.members = dto.members;
    }

    @Field() public title: string;
    @Field() public logo: string;
    @Field() public members: GroupMemberSchema[];
}

export default BaseModel(GroupsSchema);
