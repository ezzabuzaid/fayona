import { HashService, Constants } from '@core/helpers';
import { BaseModel, Entity, Field } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
import { AppUtils } from '@core/utils';
import { Roles } from '@shared/identity';
import phone from 'phone';
import { isBoolean } from 'class-validator';
import { AccountsSchema } from '@api/accounts';
@Entity(Constants.Schemas.USERS)
export class UsersSchema {
    @Field({ validate: isBoolean, default: false }) public verified?: boolean;
    @Field({
        enum: Object.values(Roles),
        default: Roles.ADMIN,
        pure: true
    }) public role?: string;
    @Field({ subdocument: true }) public profile: AccountsSchema = null;
    @Field({
        pure: true,
        // STUB test password should not return with the response
        select: false,
        required: true,
        validate: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, 'wrong_password'],
        set: (value: string) => HashService.hashSync(value)
    }) public password: string;
    @Field({
        match: [ValidationPatterns.NoSpecialChar, 'wrong_username'],
        unique: true,
        index: true
    }) public username: string;
    @Field({
        match: [ValidationPatterns.EmailValidation, 'wrong_email'],
        unique: true,
    }) public email: string;
    @Field({
        validate: [AppUtils.compose(AppUtils.hasItemWithin, phone), 'wrong_mobile'],
        unique: true,
    }) public mobile: string = null;

}

export default BaseModel(UsersSchema);
