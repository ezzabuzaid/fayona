import { HashService, Constants } from '@core/helpers';
import { BaseModel, Entity, Field } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Entity(Constants.Schemas.USERS)
export class UsersSchema {
    @Field({ lowercase: false }) public password: string;
    @Field({
        match: [ValidationPatterns.NoSpecialChar, 'Value contain special char'],
        unique: true,
    }) public username: string;
    @Field({
        match: [ValidationPatterns.EmailValidation, 'Please provide a valid email address'],
        unique: true,
    }) public email: string;

    @Field({
        validate: [
            (value) => {
                const phonenumber = parsePhoneNumberFromString(value);
                return !!phonenumber && phonenumber.isValid();
            },
            'Please enter correct phonenumber'
        ],
        unique: true,
    }) public mobile: string;

    public async hashUserPassword() {
        this.password = await HashService.hashPassword(this.password);
        return this;
    }

    public comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }
}

export const UsersModel = BaseModel<UsersSchema>(UsersSchema);
