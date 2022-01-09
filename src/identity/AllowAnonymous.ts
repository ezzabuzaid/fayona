import { Injector } from 'tiny-injector';
import { RemoveMiddleware } from '../Routing';
import { Identity } from './Identity';

/**
 * A method level decorator used to allow access by non-authenticated users to individual endpoints
 */
export function AllowAnonymous() {
    const identity = Injector.GetRequiredService(Identity);
    return RemoveMiddleware(identity.Authorize());
}
