export class ModelValidator {
    beforeValidation?(payload: any): void | Promise<void>;
    afterValidation?();
}
