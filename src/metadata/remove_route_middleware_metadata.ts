import { Type } from "../utils";

export class HttpRemoveRouteMiddlewareMetadata {
    constructor(
        public middleware: () => any,
        public controller: Type<any>,
        public handler: () => void,
    ) { }

    getHandlerName() {
        return this.controller.name + this.handler.name;
    }
}