import { Router, RequestHandler } from "express";
import { AppUtils } from "./core/utils";
import { UsersRouter } from "./api/users/users.routes";
import { AuthRoutes } from '@auth/auth.routes';

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

    private static wrapRouter(Router) {
        try {
            const router = new Router;
            if (!router.id) {
                new Error('please consider add @Router to the top of class');
            }
            this.list.push(router);
        } catch (error) {
            new Error('The provided router is not constructor');
        }
    }

    private static assignRouterTo(subRouter, superRouter) {
        //* To check if the router is alredy registerd
        const parentRouter: Router = this.getRouter(superRouter);
        if (!parentRouter) {
            throw new Error('Please register the parent router first, then try');
        }

        const path = AppUtils.joinPath(superRouter.routesPath, subRouter.routesPath);

        parentRouter.use(superRouter.routesPath, subRouter.router);
    }

    static get routerList(): RequestHandler[] {
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

// Wrapper.registerRouter(CustomersRouter);
Wrapper.registerRouter(UsersRouter);
Wrapper.registerRouter(AuthRoutes);
