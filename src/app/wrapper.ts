import { UsersRouter } from '@api/users';
import { PortalRoutes } from '@api/portal';
import { FeedbackRouter } from '@api/feedback';
import { SessionRouter } from '@api/sessions';
import { IExpressInternal, IExpressRouter } from '@lib/methods';
import { GroupsRouter, MembersRouter } from '@api/groups';
import { FileUploadRoutes, FoldersRoutes } from '@api/uploads';
import { ConversationRouter } from '@api/conversations';
import { SettingRoutes } from '@api/settings';

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
Wrapper.registerRouter(GroupsRouter);
Wrapper.registerRouter(MembersRouter);
Wrapper.registerRouter(FileUploadRoutes);
Wrapper.registerRouter(FoldersRoutes);
Wrapper.registerRouter(ConversationRouter);
Wrapper.registerRouter(SettingRoutes);
