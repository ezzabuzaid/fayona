
import assert from 'assert';
import { IExpressRouter, IExpressInternal } from '../routing';
import { notNullOrUndefined, Type } from '../utils';

@Injectable({ lifetime: ServiceLifetime.Singleton })
export class Registry {
    private list = [];

    public addController(router: Type<any>, subRouter?) {
        if (!!subRouter) {
            this.assignRouterTo(subRouter, this.wrapRouter(router));
        } else {
            this.wrapRouter(router);
        }
    }

    private wrapRouter(Router: Type<any>) {
        assert(notNullOrUndefined(Router['__router']), 'please consider add @Router on the top of class');
        const internal = Router['__router']();
        this.list.push(internal);
        return internal;
    }

    private assignRouterTo(subRouter, superRouter: IExpressRouter) {
        const internal = (subRouter as IExpressInternal).__router();
        const parentRouter = this.getRouter(superRouter);
        assert(notNullOrUndefined(parentRouter), 'Please register the parent router first, then try');
        parentRouter.use(internal.endpoint, internal.router);
    }

    get routers(): IExpressRouter[] {
        return this.list;
    }

    public getRouter({ id }) {
        const { router } = this.routers.find((routeMetadata) => routeMetadata.id === id);
        return router;
    }

}
