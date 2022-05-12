import { StatusCodes } from 'http-status-codes';

export abstract class HttpResponse {
  public StatusCode: StatusCodes;
  public Message: string;
  constructor(statusCode: StatusCodes, message: string) {
    this.StatusCode = statusCode;
    this.Message = message;
  }

  public abstract ToJson(): object;
}
