import { ProfilesSchema } from '@api/profiles';
import { Constants, HashService } from '@core/helpers';
import { AppUtils } from '@core/utils';
import { Entity, Field } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
import { Roles } from '@shared/identity';
import { isBoolean } from 'class-validator';
import phone from 'phone';
@Entity(Constants.Schemas.USERS)
export class UsersSchema {
    @Field({ validate: isBoolean, default: false }) public emailVerified?: boolean;
    @Field({ validate: isBoolean, default: false }) public mobileVerified?: boolean;
    @Field({
        enum: Object.values(Roles),
        default: Roles.ADMIN,
        pure: true
    }) public role?: string;
    @Field({
        subdocument: true,
        type: ProfilesSchema
    }) public profile: Partial<ProfilesSchema> = null;
    @Field({
        pure: true,
        select: false,
        required: true,
        set(value: string) {
            if (ValidationPatterns.Password.test(value)) {
                return HashService.hashSync(value);
            } else {
                throw new Error('wrong_password');
            }
        }
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

    get verified() {
        // NOTE: will not work since the `loadClass` are not used
        return this.emailVerified;
    }

}
