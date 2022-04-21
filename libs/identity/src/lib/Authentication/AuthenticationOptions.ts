import type { Strategy } from 'passport';
import { Injectable } from 'tiny-injector';

export interface AuthenticationStrategy {
  Name: string;
  Strategy: Strategy;
}

@Injectable()
export class AuthenticationOptions {
  public Strategies: AuthenticationStrategy[] = [];
  public DefaultStrategyName!: string;
}
