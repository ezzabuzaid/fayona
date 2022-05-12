import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { HttpResponse } from './HttpResponse';

export class SuccessResponse<T> extends HttpResponse {
  [x: string]: any;
  constructor(public Data: T, statusCode: StatusCodes, message?: string) {
    super(statusCode, message ?? getReasonPhrase(statusCode));
  }

  public static Deleted(result: any = null): SuccessResponse<any> {
    return new SuccessResponse(result, StatusCodes.OK, 'Deleted');
  }

  public static Created(result: any = null): SuccessResponse<any> {
    return new SuccessResponse(result, StatusCodes.CREATED, 'Created');
  }

  public static Updated(result: any = null): SuccessResponse<any> {
    return new SuccessResponse(result, StatusCodes.OK, 'Updated');
  }

  public static Ok(result: any = null): SuccessResponse<any> {
    return new SuccessResponse(result, StatusCodes.OK, 'Success');
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
