import { tokenService, IRefreshTokenClaim } from '@core/helpers';

export class PortalHelper {

    public static generateRefreshToken(id: string): any {
        return tokenService.generateToken<IRefreshTokenClaim>({ id }, { expiresIn: '12h' });
    }

    public static generateToken(id: string, role: number) {
        return tokenService.generateToken({ id, role }, { expiresIn: '6h' });
    }

}
