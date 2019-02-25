import { NetworkStatus } from './network-status';

abstract class Response extends Error {
    status: string;
    code: number;
}

export class SuccessResponse<T> extends Response {
    name = 'SuccessResponse';
    data: T;
    constructor(data: T, message: string, code = NetworkStatus.OK, status?: string) {
        super();
        this.message = message;
        this.code = code;
        this.data = data;
        this.status = status || NetworkStatus.getStatusText(code);
    }

}

export class ErrorResponse extends Response {
    name = 'ErrorResponse';
    error: string;
    constructor(message: string, code = NetworkStatus.BAD_REQUEST, status?: string) {
        super();
        this.message = message;
        this.code = code;
        this.status = status || NetworkStatus.getStatusText(code);
    }

}

// HTTP 200 OK: Standard response for successful HTTP requests. The actual response will depend on the request method used.

// HTTP 204 No Content: The server successfully processed the request, but is not returning any content

// HTTP 404 Not Found - The server has not found anything matching the Request-URI.

// HTTP 503 Service Unavailable: The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.
