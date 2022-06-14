export function OpenApiSchema({
  Description,
  Title,
  Format,
  Nullable,
  Required,
  ReadOnly,
  WriteOnly,
  Deprecated,
}: {
  Description: string;
  Title?: string;
  Format?: string;
  ReadOnly?: boolean;
  WriteOnly?: boolean;
  Nullable?: boolean; // FIXME: you can know if it is nullable if the type have (type | null)
  Required?: boolean; // FIXME: you can know if it is required if it does not have questionMark
  Deprecated?: boolean | string;
}): any {
  return (target: Object, propertyKey: string | symbol) => {
    //
  };
}

// FIXME: should work on complex types as well - one case is when the dto have nested property
