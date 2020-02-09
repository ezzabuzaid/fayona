import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.GROUPS)
export class GroupsSchema {
    @Field() public title: string;
    @Field() public logo: string;
    @Field() public users: string[];
}

export default BaseModel(GroupsSchema);
