import { HashService, Constants } from '@core/helpers';
import { BaseModel, Entity, Field, Body } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
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
        enum: [0, 1, 2, 3, 4],
        default: ERoles.ADMIN,
        validate: (value: ERoles) => AppUtils.isTruthy(ERoles[value])
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
        match: [ValidationPatterns.NoSpecialChar, 'wrong_username'],
        unique: true,
    }) public username: string;
    @Field({
        match: [ValidationPatterns.EmailValidation, 'wrong_email'],
        unique: true,
    }) public email: string;
    @Field({
        validate: [
            (value) => {
                const phonenumber = parsePhoneNumberFromString(value);
                return !!phonenumber && phonenumber.isValid();
            },
            'wrong_mobile'
        ],
        unique: true,
    }) public mobile: string;
    @Field({
        default: false,
        set: (value: any) => {
            if (typeof value !== 'boolean') {
                return false;
            }
            return value;
        }
    }) public verified: boolean;

}

export const UsersModel = BaseModel<UsersSchema>(UsersSchema);
