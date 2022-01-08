import { ParameterType } from "./ParameterType";

export class ParameterMetadata {
    public expectedType: any;
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
