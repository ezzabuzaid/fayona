import { StatusCodes } from 'http-status-codes';

import { ErrorResponse } from './ErrorResponse';

export class Failure extends ErrorResponse {
  constructor(public override Code: string, public override Message: string) {
    super(Message, StatusCodes.BAD_REQUEST, Code);
  }
}
