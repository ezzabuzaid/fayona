import { ValidationError, validateOrReject } from 'class-validator';
import {
  ProblemDetails,
  ProblemDetailsException,
} from 'rfc-7807-problem-details';

export async function ValidateModel(payload: any, varient: any): Promise<any> {
  const payloadInstance = new payload();
  Object.assign(payloadInstance, varient);
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
  return payload;
}
