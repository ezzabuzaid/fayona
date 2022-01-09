export class ModelValidator {
    BeforeValidation?(): void | Promise<void>;
    AfterValidation?(): Promise<any>;
}
