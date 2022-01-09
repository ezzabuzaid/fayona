
export class HttpRemoveEndpointMiddlewareMetadata {
    constructor(
        public middleware: () => any,
        public controller: Function,
        public handler: () => void,
    ) { }

    getHandlerName() {
        return this.controller.name + this.handler.name;
    }
}

