import type { Strategy } from 'passport';
import { Injectable } from 'tiny-injector';

@Injectable()
export class AuthenticationOptions {
  public Strategies: {
    Name: string;
    Strategy: Strategy;
  }[] = [];
  public DefaultStrategyName!: string;
}
