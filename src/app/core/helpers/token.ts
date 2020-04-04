import jwt = require('jsonwebtoken');
import { ERoles } from '@api/users';
import stage from './stage';
import { PrimaryID } from '@lib/mongoose';

export interface ITokenClaim {
    id: PrimaryID;
    role?: ERoles;
    readonly iat?: number;
    readonly exp?: number;
}

export interface IRefreshTokenClaim extends ITokenClaim { }

class TokenService {

    /**
     *
     * @param token
     * @returns decoded of the token
     */
    public decodeToken<T = ITokenClaim>(token: string) {
        return new Promise<T>((resolve, reject) => {
            jwt.verify(token, this.secretKey, (error, decodedToken) => {
                if (error) {
                    reject(error);
                }
                resolve(decodedToken as unknown as T);
            });
        });
    }

    /**
     *
     * @param data token payload
     * @returns the encrypted token
     */
    public generateToken<T extends ITokenClaim>(data: T, options?: jwt.SignOptions) {
        return jwt.sign(data, this.secretKey, options);
    }

    public isTokenExpired<T extends ITokenClaim>(token: T) {
        return Date.now() >= token.exp * 1000;
    }

    private get secretKey() {
        return stage.testing
            ? 'fuckSecretForTestOnly'
            : process.env.JWT_SECRET_KEY;
        // FIXME idk what the issue with this when it comes to test
    }
}

export const tokenService = new TokenService();
