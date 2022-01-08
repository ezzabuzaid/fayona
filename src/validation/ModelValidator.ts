export class ModelValidator {
    BeforeValidation?(payload: any): void | Promise<void>;
    AfterValidation?(): any;
}
