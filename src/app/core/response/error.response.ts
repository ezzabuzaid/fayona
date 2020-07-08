import { HttpResponse } from './response'; import { NetworkStatus } from '@core/helpers'; import { translate } from '@lib/translation';

export class ErrorResponse extends HttpResponse {
    constructor(message: string, code = NetworkStatus.BAD_REQUEST) {
        super(code);
        this.message = typeof message === 'string' ? translate(message) : message;
    }

}
