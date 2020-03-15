import { BaseModel, Entity, Field, Payload } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

// FIXME
// cannot use GroupMemberSchema as submodel for single or mutliple mode,
// because the declration of the subschema is different than the primitive types
// so we need to find a way to solve this by not adding at as Type https://mongoosejs.com/docs/subdocs.html
// Another Issue, is that the fields in subdocument will stay a properties unless you add @Entity which in our case
// not needed because @Entity will register it as mongose model,
//  you can pass an option with @Entity to not to create model

@Entity(Constants.Schemas.MEMBERS)
export class GroupMemberSchema {
    @Field({ required: true, ref: Constants.Schemas.USERS }) public user: Types.ObjectId = null;
    @Field() public isAdmin: boolean = false;
    @Field({ ref: Constants.Schemas.GROUPS, required: true }) public group: Types.ObjectId;
}

@Entity(Constants.Schemas.GROUPS)
export class GroupsSchema {
    @Field() public title: string;
    @Field() public logo: string;
}

export const groupModel = BaseModel(GroupsSchema);
export const groupMemberModel = BaseModel(GroupMemberSchema);
