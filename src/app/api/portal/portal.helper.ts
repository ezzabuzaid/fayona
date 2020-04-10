import { PrimaryKey } from '@lib/mongoose';
import { tokenService, IRefreshTokenClaim } from '@shared/identity';

export class PortalHelper {

    public static generateRefreshToken(id: PrimaryKey): any {
        return tokenService.generateToken<IRefreshTokenClaim>({ id }, { expiresIn: '12h' });
    }

    public static generateToken(id: PrimaryKey, role: number) {
        return tokenService.generateToken({ id, role }, { expiresIn: '6h' });
    }

}
