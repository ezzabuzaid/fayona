import {
  CoerceArray,
  HttpContext,
  InvalidOperationException,
  IsNullOrEmpty,
  IsNullOrUndefined,
  MakeHandlerName,
  Metadata,
  Middleware,
  NotNullOrEmpty,
} from '@fayona/core';
import type { NextFunction } from 'express';

import { AuthorizationOptions } from '../AuthorizationOptions';
import { AuthorizationPolicy } from '../AuthorizationPolicy';
import { AuthorizationPolicyBuilder } from '../AuthorizationPolicyBuilder';
import { AuthorizationService } from '../AuthorizationService';
import { IAuthorizeData } from '../IAuthorizeData';

export class AuthorizationMiddleware extends Middleware {
  private readonly AuthorizationService: AuthorizationService;
  private readonly AuthorizationOptions: AuthorizationOptions;
  private readonly Metadata: Metadata;
  constructor(
    authorizationService: AuthorizationService,
    metadata: Metadata,
    authorizationOptions: AuthorizationOptions
  ) {
    super();
    this.AuthorizationService = authorizationService;
    this.AuthorizationOptions = authorizationOptions;
    this.Metadata = metadata;
  }

  public async Invoke(context: HttpContext, next: NextFunction): Promise<void> {
    const authorizeData: IAuthorizeData[] =
      context.GetMetadata()?.Properties.get(IAuthorizeData) ?? [];

    const policy = this.GetPolicy(authorizeData);
    if (policy == null) {
      next(context);
      return;
    }

    const result = this.AuthorizationService.Authorize(context.User!, policy);

    if (result.Succeeded) {
      next();
    } else {
      next(result);
    }
  }

  private GetPolicy(
    authorizeData: IAuthorizeData[]
  ): AuthorizationPolicy | undefined {
    let policyBuilder: AuthorizationPolicyBuilder | undefined;

    for (const authorizeDatum of authorizeData) {
      if (IsNullOrUndefined(policyBuilder)) {
        policyBuilder = new AuthorizationPolicyBuilder();
      }

      let useDefaultPolicy = true;
      const policyName = authorizeDatum.Policy;
      if (!IsNullOrEmpty(policyName)) {
        const policy = this.AuthorizationOptions.GetPolicy(policyName);

        if (policy == null) {
          throw new InvalidOperationException(`${policy} not found.`);
        }

        policyBuilder.Combine(policy);
        useDefaultPolicy = false;
      }

      const roles = CoerceArray(authorizeDatum.Roles);
      if (roles.length) {
        const trimmedRolesSplit = roles
          .filter((r) => !IsNullOrEmpty(r))
          .map((r) => r?.trim()) as string[];

        policyBuilder.RequireRole(...trimmedRolesSplit);
        useDefaultPolicy = false;
      }

      const authTypesSplit = CoerceArray(authorizeDatum.AuthenticationSchemes);
      if (authTypesSplit.length) {
        for (const authType of authTypesSplit) {
          if (!IsNullOrEmpty(authType)) {
            policyBuilder.AuthenticationSchemes.push(authType.trim());
          }
        }
      }

      if (useDefaultPolicy) {
        policyBuilder.Combine(this.AuthorizationOptions.DefaultPolicy);
      }
    }

    // If we have no policy by now, use the fallback policy if we have one
    if (policyBuilder == null) {
      const fallbackPolicy = this.AuthorizationOptions.FallbackPolicy;
      if (!IsNullOrUndefined(fallbackPolicy)) {
        return fallbackPolicy;
      }
    }

    return policyBuilder?.Build();
  }
}
