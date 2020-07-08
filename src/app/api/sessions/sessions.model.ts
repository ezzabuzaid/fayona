import { Constants } from '@core/helpers';
import { Entity, Field } from '@lib/mongoose';
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

