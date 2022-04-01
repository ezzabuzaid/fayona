import { validateOrReject, ValidationError } from 'class-validator';
import { Type } from '../utils';
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
export async function construct<T extends ModelValidator>(classType: Type<T>, properties: Partial<T>, additionalProperties: Partial<T> = {}) {
    const payload = new classType();
    if (payload instanceof ModelValidator) {
        await payload.BeforeValidation?.();
    }
    Object.assign(payload, properties ?? {}, additionalProperties ?? {});
    console.log(payload, properties);
    await ValidatePayload(payload);
    if (payload instanceof ModelValidator) {
        await payload.AfterValidation?.();
    }
    return payload;
}

async function ValidatePayload<T extends Record<string, any>>(payload: T) {
    try {
        await validateOrReject(payload, {
            // TODO: add override options using service locator ()
            forbidUnknownValues: true,
        });
    } catch (validationErrors: any) {
        // Make it like .netcore modelstate
        const errorConstraints = (validationErrors[0] as ValidationError).constraints as any;
        const error = new Error(Object.values<string>(errorConstraints)[0]);
        error.name = MODEL_VALIDATION_ERRORS;
        throw error;
    }
}

export class ModelStateException extends Error {

}

// const openapiSpecification = swaggerJsdoc({
//     definition: {
//         openapi: '3.0.0',
//         info: { title: 'Hello World', version: '1.0.0', },
//     },
//     apis: ['**/Controllers/*.ts'],
// });

// application
//     .use(express.json())
//     .use(
//         '/api/docs',
//         swaggerUi.serve,
//         swaggerUi.setup(openapiSpecification)
//     );
