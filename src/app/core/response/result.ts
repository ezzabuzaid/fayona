import { AppUtils } from '@core/utils';

export class Result<T> {
    public hasError = false;
    public data: T = null;
    public message: string = null;

    constructor(result: Partial<Result<T>> = new Result<T>({})) {
        this.data = result.data;
        this.message = result.message || null;
        this.hasError = result.hasError ?? AppUtils.isTruthy(result.message) ?? false;
    }
}
