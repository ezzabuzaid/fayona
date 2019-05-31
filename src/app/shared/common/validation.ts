export class ValidationPatterns {
    static EmailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    static NoSpecialChar = /^[a-z0-9_-]+$/;
}