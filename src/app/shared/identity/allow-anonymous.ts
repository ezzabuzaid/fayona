import { RemoveMiddleware } from '@lib/restful';
import { identity } from './identity';

export function AllowAnonymous() {
    return RemoveMiddleware(identity.isAuthenticated());
}
