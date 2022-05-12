// CREDIT: https://github.com/c-hive/guides/blob/master/js/error-handling.md

export class InvalidOperationException extends Error {
  // constructor(...args: any[]) {
  //   super(...args);
  //   // Ensures that the error constructor isn't included in the stack trace.
  //   Error.captureStackTrace(this, InvalidOperationException);
  //   this.name = this.constructor.name;
  // }
}
