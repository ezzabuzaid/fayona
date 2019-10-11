import { HashService, Constants } from '@core/helpers';
import { BaseModel, Entity, Field } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Query } from 'mongoose';
import { translate } from '@lib/translation';

@Entity(Constants.Schemas.USERS)
export class UsersSchema {
    @Field({ pure: true, required: true }) public password: string;
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

    public async hashUserPassword() {
        this.password = await HashService.hashPassword(this.password);
        return this;
    }

    public comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }
}

export const UsersModel = BaseModel<UsersSchema>(UsersSchema);

UsersModel.schema.pre('find', () => {
    (this as unknown as Query<any>).select({ password: 0 });
});

UsersModel.schema.pre('findOne', (query) => {
    (this as unknown as Query<any>).select({ password: 0 });
});
