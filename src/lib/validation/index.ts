import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { Type } from '@lib/utils';
export const PAYLOAD_VALIDATION_ERRORS = 'payload_validator_error';

export class PayloadValidator {
    beforeValidation?();
    afterValidation?();
}

export function validate<T>(validator: Type<T>, type: 'body' | 'query' | 'params' | 'headers' | 'queryPolluted' = 'body', message?: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        _validate(validator, req[type], message);
        next();
    };
}

export async function _validate<T>(validator: Type<T>, incomingObject, message?: string) {
    const validatee = new validator();
    strictAssign(validatee, incomingObject);
    await validatePayload(validatee, message);
    return validatee;
}

export async function validatePayload<T>(payload: T, message?: string) {
    try {
        await validateOrReject(payload);
    } catch (validationErrors) {
        // TODO: Add custom validation error
        const errorConstraints = (validationErrors[0] as ValidationError).constraints;
        const error = new Error(message ?? Object.values(errorConstraints)[0]);
        error.name = PAYLOAD_VALIDATION_ERRORS;
        throw error;
    }
}

export function strictAssign<T>(thisType: ThisType<T>, payload: Partial<T>) {
    for (const key in thisType) {
        if (thisType.hasOwnProperty(key)) {
            thisType[key] = payload[key];
        }
    }
}