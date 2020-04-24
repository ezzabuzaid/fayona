import { UsersRouter } from '@api/users';
import { PortalRoutes } from '@api/portal';
import { FeedbackRouter } from '@api/feedback';
import { SessionRouter } from '@api/sessions';
import { IExpressInternal, IExpressRouter } from '@lib/restful';
import { FileUploadRoutes, FoldersRoutes } from '@api/uploads';
import { SettingRoutes } from '@api/settings';
import { RoomsRouter } from '@api/chat/rooms';
import { AppUtils } from '@core/utils';
import assert from 'assert';
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

    private static wrapRouter(Router: IExpressInternal) {
        const internal = Router.__router();
        assert(AppUtils.notNullOrUndefined(internal.id), 'please consider add @Router on the top of class');
        this.list.push(internal);
    }

    private static assignRouterTo(subRouter, superRouter) {
        const parentRouter = this.getRouter(superRouter);
        assert(AppUtils.notNullOrUndefined(parentRouter), 'Please register the parent router first, then try');
        parentRouter.use(superRouter.routesPath, subRouter.router);
    }

    static get routers(): IExpressRouter[] {
        return this.list;
    }

    public static getRouter({ id }) {
        const { router } = this.list.find(({ _router }) => _router.id === id);
        return router;
    }

    private static dispatchRouter({ router }: any) {
        this.getRouter(router);
        this.list.splice(router);
    }

}

Wrapper.registerRouter(PortalRoutes);
Wrapper.registerRouter(UsersRouter);
Wrapper.registerRouter(FeedbackRouter);
Wrapper.registerRouter(SessionRouter);
Wrapper.registerRouter(RoomsRouter);
Wrapper.registerRouter(FileUploadRoutes);
Wrapper.registerRouter(FoldersRoutes);
Wrapper.registerRouter(SettingRoutes);
