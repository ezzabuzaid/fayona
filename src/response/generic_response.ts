import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export class HttpResponse extends Error {
    public status: string;
    constructor(public code: number) {
        super();
        this.status = getReasonPhrase(code);
    }
}
