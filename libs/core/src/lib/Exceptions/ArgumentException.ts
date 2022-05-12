export class ArgumentNullException extends Error {
  constructor(message: string, paramName?: string) {
    super(`${message}${paramName ? `\nParameter name: ${paramName}` : ''}`);

    // Ensures that the error constructor isn't included in the stack trace.
    Error.captureStackTrace(this, ArgumentNullException);

    this.name = this.constructor.name;
  }
}
