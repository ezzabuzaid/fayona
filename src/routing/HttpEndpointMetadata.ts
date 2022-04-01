import { RequestHandler } from "express";
import { METHODS } from "./Methods";
import { makeHandlerName } from "./Utils";

export class HttpEndpointMetadata {
	constructor(
		public controller: Function,
		public handler: () => void,
		public endpoint: string | RegExp,
		public method: METHODS,
		public middlewares: RequestHandler[]
	) {}

	public getHandlerName(): string {
		return makeHandlerName(this.controller, this.handler.name);
	}
}
