import { NextFunction, Request, Response } from 'express';
import { Injectable, ServiceLifetime } from 'tiny-injector';
import { ErrorResponse } from '../Response';
import { Role } from './Role';
import { Claims } from './TokenHelper';


@Injectable({ lifetime: ServiceLifetime.Singleton })
export class Identity {

    /**
     * Check if the user carry the intened roles
     *
     * Authorize("HRManager") only HRManager users are authorized to continue
     *
     * Authorize("HRManager", "Finance") only HRManager or Finance users are authorized to continue
     *
     * [Authorize("HRManager"), Authorize("Finance")] only users of both HRManager and Finance roles are authorized to continue
     *
     * Will throw Forbidden response in case of authenticated user but not authorized
     */
    public Authorize(...roles: Role[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const claims = await this._authenticated(req.headers.authorization);
                // if (roles.includes(claims.role)) {
                //     return next();
                // } else {
                // }
                return ErrorResponse.MethodNotAllowed();
            } catch (error) {
                return ErrorResponse.Unauthorized();
            }
        };
    }

    /**
     * Check if user jwt token are valid and not expired
     *
     * Will throw Unauthorized response in case of failure
     */
    public Authenticated() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this._authenticated(req.headers.authorization);
                return next();
            } catch (error) {
                return ErrorResponse.Unauthorized();
            }
        };
    }

    private async _authenticated(authorization: string | undefined) {
        return new Claims('');
        // return this.tokenService.decodeTokenAsync<AccessTokenClaims>(authorization)
    }

    /**
     * Claims authorization checks the validatiy of the user identity against endpoint or route.
     *
     * you'll write the requirement logic based on user claims and the internals will proccess the user upon success
     */
    public useClaims(handler: (claims: Claims) => Promise<boolean> | boolean) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const claims = await this._authenticated(req.headers.authorization);
                if (await handler(claims)) {
                    return next();
                } else {
                    return ErrorResponse.Forbidden();
                }
            } catch (error) {
                return ErrorResponse.Unauthorized();
            }
        };
    }

    // TODO: add support for policy based authorization
    private usePolicy() { }

}

