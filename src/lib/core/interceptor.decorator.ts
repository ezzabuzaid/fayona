import { Request, Response, RouterOptions, NextFunction, Router as expressRouter, RequestHandler } from 'express';
import { MiddlewareType } from '../typing';

export function Intercept(...handlers: MiddlewareType[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    }
}

// * use observer pattren here
// * in wrapper class if any registred route has a intercept method as an instance method it will subscribe into the observer
// * this way rise the ability o life cycle of parent intercept, 

// !! BETTER
// ** alias
// * use @Intercept dec to register the method to intercept the request 
// * hince the @Router dec mark the class as router instance therefore you can have all the router method inside the dec factory  
