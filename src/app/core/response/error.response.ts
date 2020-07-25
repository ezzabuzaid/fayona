import { NetworkStatus } from '@core/helpers/network-status';
import { translate } from '@lib/translation';
import { HttpResponse } from './generic.response';

export class ErrorResponse extends HttpResponse {
    constructor(message: string, code = NetworkStatus.BAD_REQUEST) {
        super(code);
        this.message = typeof message === 'string' ? translate(message) : message;
    }

}
