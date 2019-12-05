import { NetworkStatus } from '@core/helpers/network-status';
import { translate } from '@lib/translation';

abstract class Response extends Error {
    public status: string;
    public code: number;
}

export class SuccessResponse<T> extends Response {
    [x: string]: any;
    public name = SuccessResponse.name;
    constructor(public data: T, message = translate('success'), code = NetworkStatus.OK, status?: string) {
        super();
        this.message = message;
        this.code = code;
        this.status = status || NetworkStatus.getStatusText(code);
    }

}

export class ErrorResponse extends Response {
    public name = ErrorResponse.name;
    public error: string;
    constructor(message: string, code = NetworkStatus.BAD_REQUEST) {
        super();
        this.message = message;
        this.code = code;
    }

    get status() {
        return NetworkStatus.getStatusText(this.code);
    }

}
