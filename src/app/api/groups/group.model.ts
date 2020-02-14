import { BaseModel, Entity, Field, Body } from '@lib/mongoose';
import { Constants } from '@core/helpers';

// FIXME
// cannot use GroupMemberSchema as submodel weather for single or mutliple submodel,
// because the decration of the subschema is different than the primitive types
// so we need to find a way to solve this by not adding at as Type https://mongoosejs.com/docs/subdocs.html
// Another Issue, is that the fields in subdocuments will stay properties unless you add @Entity which in our case
// not needed because @Entity will register it as mongose model
// (pass an option with @Entity to not to create model)

export class GroupMemberSchema {
    @Field({ pure: true, required: true }) public user_id: string = null;
    @Field() public isAdmin: boolean = false;
}

@Entity(Constants.Schemas.GROUPS)
export class GroupsSchema {

    constructor(dto: Body<GroupsSchema>) {
        // this.title = dto.title;
        // this.logo = dto.logo;
        // this.members = dto.members;
    }

    @Field() public title: string;
    @Field() public logo: string;
    @Field() public members: GroupMemberSchema[];
}

export default BaseModel(GroupsSchema);
