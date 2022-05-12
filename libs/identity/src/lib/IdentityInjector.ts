import { Injector, ServiceCollection } from 'tiny-injector';

export const IDENTITY_SERVICE_COLLECTION = new ServiceCollection();

export const IdentityInjector = Injector.Of(IDENTITY_SERVICE_COLLECTION);
