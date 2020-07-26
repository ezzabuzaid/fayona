import { NetworkStatus } from '@core/helpers/network-status';

export class HttpResponse extends Error {
    public status: string;
    constructor(public code: number) {
        super();
        this.status = NetworkStatus.getStatusText(code);
    }
}
