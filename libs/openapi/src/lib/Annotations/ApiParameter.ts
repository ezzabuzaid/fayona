// FIXME: replace it with Schema decorator
// required is not needed - if not question mark present then this is required param
export function OpenApiParameter(
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
