import { Injector, ServiceCollection } from "tiny-injector";

export const RoutingCollection = new ServiceCollection();
export const RoutingInjector = Injector.Of(RoutingCollection);
