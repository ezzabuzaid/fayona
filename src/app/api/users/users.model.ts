// REVIEW  consider using validation library for string
import { ValidationPatterns } from '@shared/common';
import { Logger } from '@core/utils';
import { Field, Entity } from '@lib/mongoose';
import { HashService } from '@core/helpers';
const log = new Logger('Users Model');
@Entity('users')
export class UsersModel {
    @Field({ select: false }) password: string;
    @Field({
        unique: true,
        match: [ValidationPatterns.NoSpecialChar, 'Value contain special char']
    }) username: string;
    @Field({
        unique: true,
        match: [ValidationPatterns.EmailValidation, 'Please provide a valid email address']
    }) email: string;

    async hashUserPassword() {
        this.password = await HashService.hashPassword(this.password);
        return this;
    }

    async comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }

}
