import { Entity, Field, BaseModel, ForeignKey } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.MEMBERS)
export class RoomMemberSchema {
    @Field({ required: true, ref: Constants.Schemas.USERS }) public user: ForeignKey = null;
    @Field() public isAdmin: boolean = false;
    @Field({ ref: Constants.Schemas.ROOMS, required: true }) public room: ForeignKey;
}
