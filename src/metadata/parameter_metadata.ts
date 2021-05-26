import { ParameterType } from "./parameter_type";

export class ParameterMetadata {
    public expectedType;
    constructor(
        public index: number,
        public type: ParameterType,
        public payload: any,
        private handlerName: string,
        private controllerName: string,
        public options?: any
    ) { }

    getHandlerName() {
        return this.controllerName + this.handlerName;
    }

    setExpectedType(type: any) {
        this.expectedType = type;
    }
}