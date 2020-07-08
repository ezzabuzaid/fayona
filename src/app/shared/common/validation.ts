import { validateOrReject, ValidationError, IsString, IsMongoId, Matches, IsEmail, IsJWT } from 'class-validator';
import { ApplicationConstants } from '@core/constants';
import { Type, AppUtils } from '@core/utils';
import { NextFunction, Response, Request } from 'express';
import { PrimaryKey } from '@lib/mongoose';

export class ValidationPatterns {
    public static EmailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    public static Password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    public static NoSpecialChar = /^[a-zA-z0-9_.]+$/;
}

export function isValidId() {
    class IdValidator {
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

export async function validatePayload<T>(payload: T, message?: string) {
    try {
        await validateOrReject(payload);
    } catch (validationErrors) {
        // TODO: Add custom validation error
        const errorConstraints = (validationErrors[0] as ValidationError).constraints;
        const error = new Error(message ?? Object.values(errorConstraints)[0]);
        error.name = ApplicationConstants.PAYLOAD_VALIDATION_ERRORS;
        throw error;
    }
}

export abstract class PayloadValidator { }

export function validate<T extends PayloadValidator>(validator: Type<T>, type: 'body' | 'query' | 'params' | 'headers' | 'queryPolluted' = 'body', message?: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validatee = new validator();
        AppUtils.strictAssign(validatee, req[type]);
        await validatePayload(validatee, message);
        next();
    };
}
