import { RequestHandler } from "express";
import { METHODS } from "./Methods";

export class HttpEndpointMetadata {
    constructor(
        public controller: Function,
        public handler: () => void,
        public endpoint: string | RegExp,
        public method: METHODS,
        public middlewares: RequestHandler[],
    ) { }

    getHandlerName() {
        return this.controller.name + this.handler.name;
    }
}
