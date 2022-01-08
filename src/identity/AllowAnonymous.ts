import { RemoveMiddleware } from '../Routing';
import { identity } from './Identity';


/**
 * A method level decorator used to allow access by non-authenticated users to individual endpoints
 */
export function AllowAnonymous() {
    return RemoveMiddleware(identity.Authorize());
}
