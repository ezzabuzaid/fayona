// FIXME: add deprecated attribute to Schema decorator instead
export function OpenApiObsolete(message?: string, error?: boolean): any {
  return (target: Object, propertyKey: string | symbol) => {
    //
  };
}
