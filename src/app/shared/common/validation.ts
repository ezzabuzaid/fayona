import { validateOrReject, ValidationError, IsString, IsMongoId } from 'class-validator';
import { ApplicationConstants } from '@core/constants';
import { Type, AppUtils } from '@core/utils';
import { NextFunction, Response, Request } from 'express';

export class ValidationPatterns {
    public static EmailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    public static NoSpecialChar = /^[a-zA-z0-9_.]+$/;
}

export function isValidId() {
    class IdValidator {
        @IsMongoId({ message: 'id_not_valid' }) id: string = null;
    }
    return validate(IdValidator, 'params');
}

export async function validatePayload<T>(payload: T) {
    try {
        await validateOrReject(payload);
    } catch (validationErrors) {
        const errorConstraints = (validationErrors[0] as ValidationError).constraints;
        const error = new Error(Object.values(errorConstraints)[0]);
        error.name = ApplicationConstants.PAYLOAD_VALIDATION_ERRORS;
        throw error;
    }
}

export abstract class PayloadValidator { }

export function validate<T extends PayloadValidator>(validator: Type<T>, type: 'body' | 'query' | 'params' | 'headers' | 'queryPolluted' = 'body') {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validatee = new validator();
        AppUtils.strictAssign(validatee, req[type]);
        await validatePayload(validatee);
        next();
    };
}
