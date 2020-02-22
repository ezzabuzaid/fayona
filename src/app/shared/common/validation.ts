import { validateOrReject, ValidationError } from 'class-validator';
import { ApplicationConstants } from '@core/constants';

export class ValidationPatterns {
    public static EmailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    public static NoSpecialChar = /^[a-zA-z0-9_.]+$/;
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