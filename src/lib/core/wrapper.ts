import { RequestHandler, Router } from "express";
import { CountriesRoutes } from '@api/countries';
import { UsersRouter } from '@api/users';
import { AuthRoutes } from '@api/auth';
import { AuthorsRoutes } from '@api/authors';
import { BooksRoutes } from '@api/books';
import 'reflect-metadata';
import { Injectable, Container } from '@decorators/di';
import { IExpressRouter, IExpressInternal } from '@lib/typing';
export class Wrapper {
    private static list = [];
    //! #issue fix type any, the router should defined in RouterClass
    static registerRouter(router, subRouter?) {
        // ...routerList: any[]
        // for (const { router } of routerList) {
        //     this.wrapRouter(router)
        // }
        if (!!subRouter) {
            this.wrapRouter(subRouter);
            this.assignRouterTo(subRouter, router);
        } else {
            this.wrapRouter(router);
        }
    }

    private static wrapRouter(Router: new () => IExpressInternal) {
        try {
            const router = new Router;
            const instance = router.__router();
            if (!instance.id) {
                new Error('please consider add @Router to the top of class');
            }
            this.list.push(instance);
        } catch (error) {
            new Error('The provided router is not constructor');
        }
    }

    private static assignRouterTo(subRouter, superRouter) {
        //* To check if the router is alredy registerd
        const parentRouter = this.getRouter(superRouter);
        if (!parentRouter) {
            throw new Error('Please register the parent router first, then try');
        }

        parentRouter.use(superRouter.routesPath, subRouter.router);
    }

    static get routerList(): IExpressRouter[] {
        return this.list;
    }

    static getRouter({ id }) {
        const { router } = this.list.find(({ router }) => router.id === id);
        return router;
    }

    private static dispatchRouter({ router }: any) {
        this.list.splice(router)
        //? This is not done, we need to re init all the router again, or just remove this router from both router list and router bootstrap list
    }

}

// Wrapper.registerRouter(UsersRouter);
Wrapper.registerRouter(AuthRoutes);
Wrapper.registerRouter(CountriesRoutes);
Wrapper.registerRouter(AuthorsRoutes);
Wrapper.registerRouter(BooksRoutes);
