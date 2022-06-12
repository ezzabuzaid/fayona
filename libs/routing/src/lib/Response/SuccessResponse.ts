import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { HttpResponse } from './HttpResponse';

export class SuccessResponse<T> extends HttpResponse<T> {
  [x: string]: any;
  constructor(data: T, statusCode: StatusCodes, message?: string) {
    super(data, statusCode, message ?? getReasonPhrase(statusCode));
  }

  public static Deleted<T>(result: any = null): SuccessResponse<T> {
    return new SuccessResponse<T>(result, StatusCodes.OK, 'Deleted');
  }

  public static Created<T>(result: any = null): SuccessResponse<T> {
    return new SuccessResponse<T>(result, StatusCodes.CREATED, 'Created');
  }

  public static Updated<T>(result: any = null): SuccessResponse<T> {
    return new SuccessResponse<T>(result, StatusCodes.OK, 'Updated');
  }

  public static Ok<T>(result?: T): SuccessResponse<T> {
    return new SuccessResponse<T>(result as T, StatusCodes.OK, 'Success');
  }

  public static NoContent(): SuccessResponse<any> {
    const response = new SuccessResponse(
      undefined,
      StatusCodes.NO_CONTENT,
      'Success'
    );
    return response;
  }

  public ToJson(): object {
    return {
      message: this.Message,
      code: this.StatusCode,
      data: this.Data,
    };
  }
}
