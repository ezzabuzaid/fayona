import { Constants } from '@core/helpers';
import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Types } from 'mongoose';
@Entity(Constants.Schemas.Account, {}, { required: false })
export class AccountSchema {
    @Field({ default: '' }) public image: string;
    @Field({ default: '' }) public lastName: string;
    @Field({ default: '' }) public firstName: string;
    @Field({ default: '' }) public address: string;
    @Field({ ref: Constants.Schemas.USERS }) public user_id: Types.ObjectId;
}

export const AccountModel = BaseModel<AccountSchema>(AccountSchema);
AccountModel.schema.virtual('user', {
    localField: 'user_id',
    foreignField: '_id',
    ref: Constants.Schemas.USERS,
    justOne: true
});
