// REVIEW  consider using validation library for string
import { Validation } from '@shared/common';
import { Logger } from '@core/utils';
import { BaseModel, Field, Entity } from '@lib/mongoose';
const log = new Logger('Users Model');
@Entity('users')
export class UsersModel extends BaseModel {
    @Field({ unique: true }) username: string;
    @Field({ select: false }) password: string;
    @Field({ match: [Validation.EmailValidation, 'Please provide a valid email address'] }) email: string;
}
