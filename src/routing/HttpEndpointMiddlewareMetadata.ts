import { makeHandlerName } from "./Utils";

export class HttpEndpointMiddlewareMetadata {
    constructor(
        public middleware: () => any,
        public controller: Function,
        public handler: () => void,
    ) { }

    getHandlerName() {
        return makeHandlerName(this.controller, this.handler.name);
    }
}

