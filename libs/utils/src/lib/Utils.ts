export function IsNullOrUndefined(value: any): value is undefined | null {
  return value === undefined || value === null;
}

export function NotNullOrUndefined<T>(
  value: T
): value is Exclude<T, null | undefined> {
  return !IsNullOrUndefined(value);
}
