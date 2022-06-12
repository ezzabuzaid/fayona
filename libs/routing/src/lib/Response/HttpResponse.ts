import { StatusCodes } from 'http-status-codes';

export abstract class HttpResponse<T> {
  public StatusCode: StatusCodes;
  public Message: string;
  public Data?: T;
  constructor(data: T, statusCode: StatusCodes, message: string) {
    this.StatusCode = statusCode;
    this.Message = message;
    this.Data = data;
  }

  public abstract ToJson(): object;
}
