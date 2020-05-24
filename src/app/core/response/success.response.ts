import { HttpResponse } from './response';
import { NetworkStatus } from '@core/helpers';
import { translate } from '@lib/translation';

export class SuccessResponse<T> extends HttpResponse {
    [x: string]: any;
    constructor(public data: T, message = 'success', code = NetworkStatus.OK) {
        super(code);
        this.message = typeof message === 'string' ? translate(message) : message;
    }

}
