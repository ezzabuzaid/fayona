import { Role } from './Role';
import { IdentitySecret } from './Secret';
import jwt = require('jsonwebtoken');

export class Claims {
    readonly iat?: number;
    readonly exp?: number;

    constructor(
        public readonly id: string,
    ) { }

    toJson() {
        return JSON.parse(JSON.stringify(this));
    }
}

export class AccessTokenClaims extends Claims {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly role: Role,
        public readonly phoneVerifed: boolean
    ) {
        super(id);
    }

}

export class RefreshTokenClaims extends Claims {

    constructor(
        public readonly id: string,
    ) {
        super(id);
    }

}


@Singelton()
export class TokenHelper {

    public decodeTokenAsync<T extends Claims>(token: string, options?: jwt.SignOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            jwt.verify(token, this.secretKey, options, (error, decodedToken) => {
                if (error) {
                    reject(error);
                }
                resolve(decodedToken as unknown as T);
            });
        });
    }

    public decodeToken<T extends Claims>(token: string): T {
        return jwt.verify(token, this.secretKey) as T;
    }

    public generateToken<T extends Claims>(claims: T, options?: jwt.SignOptions) {
        return jwt.sign(claims.toJson(), this.secretKey, options);
    }

    public isTokenExpired<T extends Claims>(decodedToken: T) {
        return Date.now() >= decodedToken.exp * 1000;
    }

    get secretKey() {
        const secret = locate(IdentitySecret);
        if (!secret) {
            throw new Error('IdentitySecret is not registerd as part of service locator');
        }
        return secret.getSecret();
    }

}
