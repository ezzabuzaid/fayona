import { AdminRouter } from '@api/admin';
import { MealsRouter } from '@api/meals';
import { MenusRouter } from '@api/menus';
import { PortalRoutes } from '@api/portal';
import { UsersRouter } from '@api/users';
import { FavoritesRouter } from '@api/favorites';
import { ContactUsRouter } from '@api/contactUs';
import { FeedbackRouter } from '@api/feedback';
import { AccountRouter } from '@api/accounts';
import { IExpressInternal, IExpressRouter } from '@lib/methods';
import 'reflect-metadata';
export class Wrapper {
    private static list = [];
    public static registerRouter(router, subRouter?) {
        if (!!subRouter) {
            this.wrapRouter(subRouter);
            this.assignRouterTo(subRouter, router);
        } else {
            this.wrapRouter(router);
        }
    }

    private static wrapRouter(Router: new () => IExpressInternal) {
        try {
            const router = new Router();
            const instance = router.__router();
            if (!instance.id) {
                throw new Error('please consider add @Router to the top of class');
            }
            this.list.push(instance);
        } catch (error) {
            throw new Error('The provided router is not constructor');
        }
    }

    private static assignRouterTo(subRouter, superRouter) {
        const parentRouter = this.getRouter(superRouter);
        if (!parentRouter) {
            throw new Error('Please register the parent router first, then try');
        }

        parentRouter.use(superRouter.routesPath, subRouter.router);
    }

    static get routerList(): IExpressRouter[] {
        return this.list;
    }

    public static getRouter({ id }) {
        const { router } = this.list.find(({ _router }) => _router.id === id);
        return router;
    }

    private static dispatchRouter({ router }: any) {
        this.list.splice(router);
        // tslint:disable-next-line: max-line-length
        // ? This is not done, we need to re init all the router again, or just remove this router from both router list and router bootstrap list
    }

}

Wrapper.registerRouter(PortalRoutes);
Wrapper.registerRouter(UsersRouter);
Wrapper.registerRouter(AdminRouter);
Wrapper.registerRouter(MealsRouter);
Wrapper.registerRouter(MenusRouter);
Wrapper.registerRouter(FavoritesRouter);
Wrapper.registerRouter(ContactUsRouter);
Wrapper.registerRouter(FeedbackRouter);
Wrapper.registerRouter(AccountRouter);
// Wrapper.registerRouter(BooksRoutes);
