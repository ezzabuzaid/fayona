import jwt = require('jsonwebtoken');
import { ERoles } from '@api/users';

export interface ITokenClaim {
    id: string;
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
            jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedToken) => {
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
        return jwt.sign(data, process.env.JWT_SECRET_KEY, options);
    }

    public isTokenExpired<T extends ITokenClaim>(token: T) {
        return Date.now() >= token.exp * 1000;
    }
}

export const tokenService = new TokenService();
