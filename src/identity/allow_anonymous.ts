import { RemoveMiddleware } from '../restful';
import { identity } from './identity';


/**
 * A method level decorator used to allow access by non-authenticated users to individual endpoints 
 */
export function AllowAnonymous() {
    return RemoveMiddleware(identity.Authorize());
}
