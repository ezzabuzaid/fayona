import { PrimaryKey } from '@lib/mongoose';
import { IsEmail, IsJWT, IsMongoId, IsString, Matches } from 'class-validator';
import { validate, PayloadValidator } from '@lib/validation';

export class ValidationPatterns {
    public static EmailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    public static Password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    public static NoSpecialChar = /^[a-zA-z0-9_.]+$/;
}

export function isValidId() {
    class IdValidator extends PayloadValidator {
        @IsMongoId({ message: 'id_not_valid' }) id: string = null;
    }
    return validate(IdValidator, 'params');
}

export class NameValidator {
    @IsString({ message: 'please provide valid name' })
    name: string = null;
}

export class EmailValidator {
    @IsEmail()
    email: string = null;
}

export class PasswordValidator {
    @Matches(ValidationPatterns.Password, { message: 'wrong_password' })
    password: string = null;
}

export class TokenValidator {
    @IsJWT()
    token: string = null;
}

export class PrimaryIDValidator {
    @IsMongoId() id: PrimaryKey = null;
}
