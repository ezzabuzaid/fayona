import { ValidationError, validateOrReject } from 'class-validator';
import {
  ProblemDetails,
  ProblemDetailsException,
} from 'rfc-7807-problem-details';

export async function ValidateModel(payload: any, varient: any): Promise<any> {
  const payloadInstance = new payload();
  Merge(payloadInstance, varient);

  try {
    await validateOrReject(payloadInstance);
  } catch (error: any) {
    const errors = error.reduce(
      (
        errorMap: Record<string, string[]>,
        validationError: ValidationError
      ) => {
        errorMap[validationError.property] = Object.values(
          validationError.constraints ?? {}
        );
        return errorMap;
      },
      {}
    );
    const problemDetails = new ProblemDetails(
      '400',
      'One or more validation errors occurred.',
      400
    );
    problemDetails['errors'] = errors;
    throw new ProblemDetailsException(problemDetails);
  }
  return payloadInstance;
}

function Merge<T extends Record<string, any>>(
  thisType: T,
  payload: Partial<T>
): void {
  for (const key in thisType) {
    // eslint-disable-next-line no-prototype-builtins
    if (thisType.hasOwnProperty(key) && payload[key] !== undefined) {
      (thisType as any)[key] = payload[key];
    }
  }
}
