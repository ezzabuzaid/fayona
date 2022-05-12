import { Injector, ServiceCollection } from 'tiny-injector';

export const CORE_SERVICE_COLLECTION = new ServiceCollection();

export const CoreInjector = Injector.Of(CORE_SERVICE_COLLECTION);
