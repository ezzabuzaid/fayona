import { Request, Response, RouterOptions, NextFunction, Router as expressRouter, RequestHandler } from 'express';
import { MiddlewareType } from '../typing';

export function Middleware(...handlers: MiddlewareType[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    }
}