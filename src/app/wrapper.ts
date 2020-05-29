import { UsersRouter } from '@api/users';
import { PortalRoutes } from '@api/portal';
import { FeedbackRouter } from '@api/feedback';
import { SessionRouter } from '@api/sessions';
import { IExpressInternal, IExpressRouter } from '@lib/restful';
import { FileUploadRoutes } from '@api/uploads';
import { SettingRoutes } from '@api/settings';
import { RoomsRouter } from '@api/chat/rooms';
import { AppUtils } from '@core/utils';
import assert from 'assert';
import { LookupsRoutes } from '@api/lookups';
import { AdvertisementRouter } from '@api/advertisement';

export class Wrapper {
    private static list = [];
    public static registerRouter(router, subRouter?) {
        if (!!subRouter) {
            this.assignRouterTo(subRouter, this.wrapRouter(router));
        } else {
            this.wrapRouter(router);
        }
    }

    private static wrapRouter(Router: IExpressInternal) {
        assert(AppUtils.notNullOrUndefined(Router.__router), 'please consider add @Router on the top of class');
        const internal = Router.__router();
        this.list.push(internal);
        return internal;
    }

    private static assignRouterTo(subRouter, superRouter: IExpressRouter) {
        const internal = (subRouter as IExpressInternal).__router();
        const parentRouter = this.getRouter(superRouter);
        assert(AppUtils.notNullOrUndefined(parentRouter), 'Please register the parent router first, then try');
        parentRouter.use(internal.uri, internal.router);
    }

    static get routers(): IExpressRouter[] {
        return this.list;
    }

    public static getRouter({ id }) {
        const { router } = this.routers.find((routeMetadata) => routeMetadata.id === id);
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
Wrapper.registerRouter(SettingRoutes);
Wrapper.registerRouter(AdvertisementRouter);
Wrapper.registerRouter(LookupsRoutes);
