import { Type } from "@lib/utils";

export class HttpRemoveEndpointMiddlewareMetadata {
    constructor(
        public middleware: () => any,
        public controller: Type<any>,
        public handler: () => void,
    ) { }

    getHandlerName() {
        return this.controller.name + this.handler.name;
    }
}

