import { ValidationError, validateOrReject } from 'class-validator';
import {
  ProblemDetails,
  ProblemDetailsException,
} from 'rfc-7807-problem-details';
import { ClassType } from 'tiny-injector/Types';

import { FromBodyPayloadType } from '../Metadata/FromBodyParameterMetadata';
import { ModelBinding } from './ModelBinding';

export class FromBodyModelBinding extends ModelBinding<
  FromBodyPayloadType,
  ClassType<any>
> {
  public override async Bind(): Promise<FromBodyPayloadType> {
    const payload = new this.ParameterMetadata.Payload();
    Object.assign(payload, this.Variant);
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
      problemDetails['Errors'] = errors;
      throw new ProblemDetailsException(problemDetails);
    }
    return payload;
  }

  private IsUserDefinedType(type: any): boolean {
    return ![String, Number, Object, Symbol, Date, Promise, Proxy].includes(
      type
    );
  }
}
