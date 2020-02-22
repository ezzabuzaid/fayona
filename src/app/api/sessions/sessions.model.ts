import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';
import { IsMongoId } from "class-validator";
import { AppUtils } from '@core/utils';

@Entity(Constants.Schemas.SESSIONS)
export class SessionSchema {
    @Field() public active: boolean = true;
    // TODO rename it to user
    @Field() public user_id: Types.ObjectId;
    @Field() public device_uuid: string;
    // TODO: create a collection for device info
    // TODO: presist device info and user location
}

export const SessionModel = BaseModel<SessionSchema>(SessionSchema);

export class IDeactivateSessionPayload {
    @IsMongoId({}) user_id: string = null;
    @IsMongoId({}) session_id: string = null;
    constructor(payload: IDeactivateSessionPayload) {
        AppUtils.strictAssign(this, payload);
    }
}
