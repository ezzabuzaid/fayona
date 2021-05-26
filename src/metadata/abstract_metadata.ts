import { RequestHandler } from "express";
import { METHODS } from "./methods";

export interface IMetadata {
    uri: string;
    middlewares: RequestHandler[];
    method: METHODS;
    handler: (...args: any[]) => any;
}
