import { FromRoutePayloadType } from '../Metadata/FromRouteParameterMetadata';
import { ModelBinding } from './ModelBinding';

const constraintsMap = {
  number: ['min', 'max', 'range', 'decimal', 'double', 'float', 'long'],
  string: ['regex', 'alpha', 'maxlength', 'minlength', 'length'],
};
// Each of them should implement IRouteConstraint

export class FromRouteModelBinding extends ModelBinding<
  FromRoutePayloadType,
  Record<string, any>
> {
  public override Bind(): any {
    const paramDefinition = this.ParameterMetadata.Payload;
    const complexValidation = paramDefinition.includes(':');
    const incomingValue = this.Variant[this.ParameterMetadata.Payload];
    let finalValue: any = incomingValue;
    if (complexValidation) {
      const [paramName, paramType, ...constraints] = paramDefinition.split(':');
      //
    } else {
      if (this.ParameterMetadata.ParamType === Number) {
        finalValue = Number(incomingValue);
        if (Number.isNaN(finalValue)) {
          throw new Error();
        }
      } else if (this.ParameterMetadata.ParamType === Boolean) {
        if (['false', 'true'].includes(incomingValue.toLowerCase())) {
          finalValue = Boolean(incomingValue);
        }
        throw new Error();
      }
    }
    // if validation is not configured then pass it as is
    return finalValue;
  }
}
