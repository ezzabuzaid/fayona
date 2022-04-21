export function IsNullOrUndefined(value: any): value is undefined | null {
  return value === undefined || value === null;
}

export function NotNullOrUndefined<T>(
  value: T
): value is Exclude<T, null | undefined> {
  return !IsNullOrUndefined(value);
}

export const MakeHandlerName = (target: Function, methodName: string) => {
  return target.name + methodName;
};

export function IsNullOrEmpty<T extends string | undefined>(
  value: T
): value is Exclude<T, null | undefined> {
  return value === '' || value === null;
}
