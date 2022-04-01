import passport from "passport";
import { Injectable } from "tiny-injector";


@Injectable()
export class AuthenticationOptions {
	Strategies: { Name: string, Strategy: passport.Strategy }[] = [];
	DefaultStrategyName!: string;
}
