import { AppUtils } from '@core/utils';

export class Result<T> {
    static Error = AppUtils.generateAlphabeticString();
    public hasError = false;
    public data: T = null;
    public message: string = null;
    public throwIfError = true;

    constructor(result?: Partial<Result<T>>) {
        this.data = result.data ?? null;
        this.message = result.message ?? null;
        this.hasError = result.hasError ?? AppUtils.isTruthy(result.message) ?? false;
        this.throwIfError = result.throwIfError ?? true;
        if (this.hasError && this.throwIfError) {
            const error = new Error(this.message);
            error.name = Result.Error;
            throw error;
        }
    }
}
