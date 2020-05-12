import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.SESSIONS)
export class SessionSchema {
    @Field() public active: boolean = true;
    @Field({
        required: true,
        ref: Constants.Schemas.USERS
    }) public user: Types.ObjectId;
    @Field({ lowercase: false }) public device_uuid: string;
    // TODO: create a collection for device info
    // TODO: presist device info and user location
}

export default BaseModel<SessionSchema>(SessionSchema);
