import { HttpContext } from '@fayona/core';
import type { Strategy } from 'passport';
import { ProblemDetailsException } from 'rfc-7807-problem-details';
import { Injectable, ServiceLifetime } from 'tiny-injector';

import { AuthenticationProblemDetailsException } from '../Authentication';
import { ClaimsPrincipal } from '../Claims';

@Injectable({
  lifetime: ServiceLifetime.Transient,
})
export class FromStrategy<T extends new (...args: any) => Strategy> {
  constructor(private httpContext: HttpContext) {}

  public async Authenticate(
    strategy: T,
    ...args: ConstructorParameters<T>
  ): Promise<ClaimsPrincipal> {
    return new Promise((resolve, reject) => {
      const strategyInstance: any = new strategy(...Array.from(args));

      const errorHandler = (error: any): void => {
        if (error instanceof ProblemDetailsException) {
          Error.captureStackTrace(error, errorHandler);
          throw error;
        }
        if (error instanceof Error) {
          const exception = new AuthenticationProblemDetailsException({
            status: 401,
            detail: error.message,
          });
          exception.stack = error.stack;
          throw exception;
        }
        // called when the developer pass an error object to done function
        // strategyInstance.error(error);
      };

      Object.assign(strategyInstance, {
        error: errorHandler,
        fail: (challenge: Error, status: any) => {
          const exception = new AuthenticationProblemDetailsException({
            status: 401,
          });
          if (challenge instanceof Error) {
            exception.Details.title = challenge?.message;
            exception.stack = challenge.stack;
          }
          throw exception;
          // called when the challenge had failed
          // strategyInstance.fail(challenge, status);
        },
        success: (user: ClaimsPrincipal, info: any) => {
          // strategyInstance.success(user, info);
          resolve(user);
        },
      });
      strategyInstance.authenticate(this.httpContext.Request);
    });
  }
}
