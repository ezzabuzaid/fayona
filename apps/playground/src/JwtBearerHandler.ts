import {
  AuthenticationProperties,
  ClaimsPrincipal,
  FromStrategy,
  IAuthenticationHandler,
} from '@fayona/identity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, ServiceLifetime } from 'tiny-injector';

@Injectable({
  lifetime: ServiceLifetime.Transient,
})
export class JwtBearerHandler extends IAuthenticationHandler {
  constructor(private _fromStrategy: FromStrategy<typeof Strategy>) {
    super();
  }
  public Authenticate(): Promise<ClaimsPrincipal> {
    return this._fromStrategy.Authenticate(
      Strategy,
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'shhhhh',
      },
      (payload, done) => {
        // done(
        //   new ProblemDetailsException({
        //     status: 401,
        //     title: 'Un',
        //   }),
        //   false
        // );
        done(null, new ClaimsPrincipal());
      }
    );
  }

  public Challenge(properties?: AuthenticationProperties): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public Forbid(properties?: AuthenticationProperties): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
