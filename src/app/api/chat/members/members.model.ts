import { Constants } from '@core/constants';
import { Entity, Field, ForeignKey } from '@lib/mongoose';

@Entity(Constants.Schemas.MEMBERS)
export class RoomMemberSchema {
    @Field({ required: true, ref: Constants.Schemas.USERS }) public user: ForeignKey = null;
    @Field() public isAdmin: boolean = false;
    @Field({ ref: Constants.Schemas.ROOMS, required: true }) public room: ForeignKey;
}
