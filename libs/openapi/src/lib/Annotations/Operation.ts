export function OpenApiOperation({
  Summary,
  Description,
  OperationId,
  Tags,
}: {
  Summary: string;
  Description?: string;
  OperationId?: string;
  Tags?: string[];
}): MethodDecorator {
  return () => {
    //
  };
}
