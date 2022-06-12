export function OpenApiRequestBody(
  description: string,
  required = true
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    //
  };
}
