import { RequestHandler } from "express";
import { METHODS } from "./methods";

export class HttpRouteMetadata {
    constructor(
        public controller: Function,
        public handler: () => void,
        public endpoint: string,
        public method: METHODS,
        public middlewares: RequestHandler[],
    ) { }

    getHandlerName() {
        return this.controller.name + this.handler.name;
    }
}