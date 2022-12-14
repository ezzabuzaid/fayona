import { ValidationError, validateOrReject } from 'class-validator';
import {
  ProblemDetails,
  ProblemDetailsException,
} from 'rfc-7807-problem-details';

export async function ValidateModel(payload: any): Promise<any> {
  try {
    await validateOrReject(payload);
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
}
