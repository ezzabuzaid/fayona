import { HashService, Constants } from '@core/helpers';
import { BaseModel, Entity, Field, Body } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { translate } from '@lib/translation';
import { AppUtils } from '@core/utils';

export enum ERoles {
    SUPERADMIN,
    ADMIN,
    CLIENT,
    CUSTOMER,
}

@Entity(Constants.Schemas.USERS)
export class UsersSchema {
    @Field({
        enum: Object.values(ERoles)
    }) public role: ERoles;
    @Field({
        default: {},
        set: (value: string) => {
            return AppUtils.isNullOrUndefined(value) ? {} : value;
        }
    }) public profile: {}; // TODO: update this field to be ProfileSchema instead
    @Field({
        pure: true,
        required: true,
        set: (value: string) => HashService.hashSync(value)
    }) public password: string;
    @Field({
        match: [ValidationPatterns.NoSpecialChar, translate('no_speical_char')],
        unique: true,
    }) public username: string;
    @Field({
        match: [ValidationPatterns.EmailValidation, translate('wrong_email')],
        unique: true,
    }) public email: string;
    @Field({
        validate: [
            (value) => {
                const phonenumber = parsePhoneNumberFromString(value);
                return !!phonenumber && phonenumber.isValid();
            },
            translate('wrong_mobile_number')
        ],
        unique: true,
    }) public mobile: string;
    @Field({
        pure: true,
        default: false
    }) public verified: boolean;

    public comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }
}

export const UsersModel = BaseModel<UsersSchema>(UsersSchema);
