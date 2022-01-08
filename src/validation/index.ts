import { validateOrReject, ValidationError } from 'class-validator';
import { notNullOrUndefined, Type } from '../utils';
import { ModelValidator } from './ModelValidator';
export const MODEL_VALIDATION_ERRORS = 'payload_validator_error';

/**
 *
 * Construct the givin Type Class and perform validation check to see if the givin properties are adhering the rules
 *
 * Basically what it does is create new instance `new classType()`
 * then assign the @param properties and @param additionalProperties
 * then validate it to check if the values as intended
 *
 * @param classType
 * @param properties
 * @param additionalProperties
 *
 * @returns the created instance
 * @exception ModelStateException with complete details about the violation
 */
export async function construct<T>(classType: Type<T>, properties: Partial<T>, additionalProperties: Partial<T> = {}) {
    const payload = new classType();
    if (payload instanceof ModelValidator) {
        await (payload['beforeValidation'] && payload['beforeValidation'](properties));
    }
    strictAssign(payload, properties);
    strictAssign(payload, additionalProperties);
    await validatePayload(payload);
    return payload;
}

async function validatePayload<T>(payload: T) {
    try {
        await validateOrReject(payload, {
            // TODO: add override options using service locator ()
            forbidUnknownValues: true,
        });
    } catch (validationErrors) {
        // Make it like .netcore modelstate
        const errorConstraints = (validationErrors[0] as ValidationError).constraints;
        const error = new Error(Object.values<string>(errorConstraints)[0]);
        error.name = MODEL_VALIDATION_ERRORS;
        throw error;
    }
}

function strictAssign<T>(thisType: ThisType<T>, payload: Partial<T>) {
    for (const key in thisType) {
        if (thisType.hasOwnProperty(key) && notNullOrUndefined(payload[key])) {
            thisType[key] = payload[key];
        }
    }
}

export class ModelStateException extends Error {

}
