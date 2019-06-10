// REVIEW  consider using validation library for string
import { HashService } from '@core/helpers';
import { Logger } from '@core/utils';
import { BaseModel, Entity, Field } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
const log = new Logger('AdminSchema');

@Entity('admins')
export class AdminSchema {
    @Field({
        select: false
        // TODO password is returned
    }) public password: string;
    @Field({
        match: [ValidationPatterns.NoSpecialChar, 'Value contain special char'],
        unique: true,
        minlength: 8
    }) public username: string;
    // @Field({
    //     match: [ValidationPatterns.EmailValidation, 'Please provide a valid email address'],
    //     unique: true,
    // }) public email: string;

    public async hashUserPassword() {
        this.password = await HashService.hashPassword(this.password);
        return this;
    }

    public async comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }
}

export const AdminModel = BaseModel<AdminSchema>(AdminSchema);
