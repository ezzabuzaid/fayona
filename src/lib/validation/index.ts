import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { Type } from '@lib/utils';
export const PAYLOAD_VALIDATION_ERRORS = 'payload_validator_error';

export class PayloadValidator {
    beforeValidation?(payload): void | Promise<void>;
    afterValidation?();
}

// FIXME: Remove this and rename _validate to validate
export function validate<T>(
    validator: Type<T>,
    type: 'body' | 'query' | 'params' | 'headers' | 'queryPolluted' = 'body',
    message?: string
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        doValidate(validator, req[type], message);
        next();
    };
}

export async function doValidate<T extends PayloadValidator>(payloadType: Type<T>, incomingPayload, message?: string) {
    const payload = new payloadType();
    await (payload.beforeValidation && payload.beforeValidation(incomingPayload));
    strictAssign(payload, incomingPayload);
    await validatePayload(payload, message);
    return payload;
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
