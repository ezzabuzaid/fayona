import { NetworkStatus } from '@core/helpers/network-status';

// tslint:disable-next-line: class-name
abstract class _Response extends Error {
    public status: string;
    public code: number;
}

export class SuccessResponse<T> extends _Response {
    [x: string]: any;
    public name = SuccessResponse.name;
    public data: T;
    constructor(data: T, message: string, code = NetworkStatus.OK, status?: string) {
        super();
        this.message = message;
        this.code = code;
        this.data = data;
        this.status = status || NetworkStatus.getStatusText(code);
    }

}

export class ErrorResponse extends _Response {
    public name = ErrorResponse.name;
    public error: string;
    constructor(message: string, code = NetworkStatus.BAD_REQUEST, status?: string) {
        super();
        this.message = message;
        this.code = code;
        this.status = status || NetworkStatus.getStatusText(code);
    }

}
