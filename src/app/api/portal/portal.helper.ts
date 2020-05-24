import { PrimaryKey } from '@lib/mongoose';
import { tokenService, IRefreshTokenClaim } from '@shared/identity';

export class PortalHelper {

    public static generateRefreshToken(id: PrimaryKey) {
        return tokenService.generateToken<IRefreshTokenClaim>({ id }, { expiresIn: '12h' });
    }

    public static generateToken(id: PrimaryKey, role: string, verified: boolean) {
        return tokenService.generateToken({ id, role, verified }, { expiresIn: '6h' });
    }

    public static generatePinCode(length = 6) {
        const digits = '0123456789';
        return (Array.from({ length }).reduce((pin) => pin + digits[Math.floor(Math.random() * 10)], '') as string[])
            .join('');
    }

}
