import type { ServiceType } from 'tiny-injector';

export function IsNullOrUndefined(value: any): value is undefined | null {
  return value === undefined || value === null;
}

export function NotNullOrUndefined<T>(
  value: T
): value is Exclude<T, null | undefined> {
  return !IsNullOrUndefined(value);
}

export const MakeHandlerName = (
  target: Function,
  methodName: string
): string => {
  return target.name + methodName;
};

export function IsNullOrEmpty<T extends string | undefined | null>(
  value: T
): value is Exclude<T, string> {
  return IsNullOrUndefined(value) || value === '';
}
export function NotNullOrEmpty<T extends string | undefined | null>(
  value: T
): value is Exclude<Exclude<T, undefined>, null> {
  return value !== '' && !IsNullOrUndefined(value);
}

export function GenerateAlphabeticString(stringLength = 5): string {
  let randomString = '';
  let randomAscii: number;
  const asciiLow = 65;
  const asciiHigh = 90;
  for (let i = 0; i < stringLength; i++) {
    randomAscii = Math.floor(Math.random() * (asciiHigh - asciiLow) + asciiLow);
    randomString += String.fromCharCode(randomAscii);
  }
  return randomString;
}

export function IsConstructor<T = ServiceType<any>>(value: any): value is T {
  if (IsNullOrUndefined(value)) {
    return false;
  }

  if (value.toString().startsWith('function')) {
    return false;
  }

  return !!value.prototype && !!value.prototype.constructor.name;
}

export function CoerceArray<T>(value: T | T[]): T[];
export function CoerceArray<T>(value: T | readonly T[]): readonly T[];
export function CoerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function SaveReturn<T>(fn: (...args: any[]) => T): T | null {
  try {
    return fn();
  } catch (error) {
    return null;
  }
}
