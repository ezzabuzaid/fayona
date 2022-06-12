import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { HttpResponse } from './HttpResponse';

export class ErrorResponse extends HttpResponse<unknown> {
  constructor(
    message: string,
    statusCode = StatusCodes.BAD_REQUEST,
    public Code?: string
  ) {
    super(undefined, statusCode, message);
  }

  public static BadRequest(message: string, code: string): ErrorResponse {
    return new ErrorResponse(message, StatusCodes.BAD_REQUEST, code);
  }

  public static Unauthorized(): ErrorResponse {
    return new ErrorResponse(
      getReasonPhrase(StatusCodes.UNAUTHORIZED),
      StatusCodes.UNAUTHORIZED,
      'unauthorized'
    );
  }

  public static Forbidden(): ErrorResponse {
    return new ErrorResponse(
      'You are not allowed to access this resource',
      StatusCodes.FORBIDDEN,
      'forbidden'
    );
  }

  public static MethodNotAllowed(): ErrorResponse {
    return new ErrorResponse(
      getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
      StatusCodes.METHOD_NOT_ALLOWED,
      'method_not_allowed'
    );
  }

  public ToJson(): object {
    return {
      message: this.Message,
      code: this.Code ?? undefined,
    };
  }
}
