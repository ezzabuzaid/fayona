import { RequestHandler, RouterOptions, Router } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';

export interface IRouterDecorationOption extends RouterOptions {
    /**
     * Register child route under the parent prefix
     * 
     * e.g:
     * 
     * @Route('restaurants', {
     *  children: [MealController]
     * })
     * class RestaurantController {}
     * 
     * 
     * @Route('meals')
     * class MealController {}
     * 
     * so in order to hit the meals, you will call `restaurants/meals`
     * 
     * Note: you mustn't explicty register ChildController via AddController method in startup configuration
     */
    children?: any[];

    /**
     * Set of middleware will be executed before calling the final endpoint
     * 
     * e.g: identity.Authorize()
     */
    middleware?: RequestHandler[] | RequestHandlerParams[];
}

export interface IExpressRouter {
    router: Router;
    id: string;
    endpoint: string;
}

export interface IExpressInternal {
    __router: () => IExpressRouter;
}
