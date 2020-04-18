import { PrimaryKey } from '@lib/mongoose';
import { tokenService, IRefreshTokenClaim, ERoles } from '@shared/identity';

export class PortalHelper {

    public static generateRefreshToken(id: PrimaryKey): any {
        return tokenService.generateToken<IRefreshTokenClaim>({ id }, { expiresIn: '12h' });
    }

    public static generateToken(id: PrimaryKey, role: ERoles) {
        return tokenService.generateToken({ id, role }, { expiresIn: '6h' });
    }

}
