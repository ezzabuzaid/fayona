import { UsersSchema, ERoles } from '@api/users';
import { Body } from '@lib/mongoose';
import { superAgent } from '@test/index';
import { Constants, NetworkStatus, tokenService } from '@core/helpers';
import { getUri, generateExpiredToken, UserUtilityFixture, sendRequest } from '@test/fixture';
import { AppUtils } from '@core/utils';
import { IRefreshTokenBody } from './portal.routes';
import { PortalHelper } from './portal.helper';

const ENDPOINT = (suffix: string) => getUri(`${Constants.Endpoints.PORTAL}/${suffix}`);
const LOGIN_ENDPOINT = ENDPOINT(Constants.Endpoints.LOGIN);
const RESET_ENDPOINT = ENDPOINT(Constants.Endpoints.RESET_PASSWORD);
const FORGET_ENDPOINT = ENDPOINT(Constants.Endpoints.FORGET_PASSWORD);
const REFRESH_TOKEN = ENDPOINT(Constants.Endpoints.REFRESH_TOKEN);

const mockUser = {
    password: '123456789',
    username: 'portalLogin',
    email: 'portal@login.com',
    mobile: '0792807794',
    profile: null,
    role: ERoles.SUPERADMIN
} as Body<UsersSchema>;

describe('Login should fail if..', () => {
    it('Request with non existing user', async () => {
        const req = (await superAgent).post(LOGIN_ENDPOINT);
        const res = await req.send(AppUtils.assignObject({}, mockUser, {
            username: 'fakeUsername',
            password: 'fakePassword'
        }));
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    it('The Username was wrong', async () => {
        const req = (await superAgent).post(LOGIN_ENDPOINT);
        const res = await req.send(AppUtils.assignObject({}, mockUser, { username: 'fakeUsername' }));
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    it('The password was wrong', async () => {
        const req = (await superAgent).post(LOGIN_ENDPOINT);
        const res = await req.send(AppUtils.assignObject({}, mockUser, { password: 'fakePassword' }));
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    it.todo('User has more than three session');
});

describe('Forgot password ', () => {
    it.todo('refactor');
});

describe('Reset password ', () => {
    it.todo('refactor');
});

describe('Refresh Token', () => {
    const getResponse = (invalidToken: string, token: string = null) => {
        return sendRequest(REFRESH_TOKEN, { refreshToken: invalidToken, token } as IRefreshTokenBody);
    };

    const INVALID_TOKEN = 'invalid.token.refuesed';
    it('should throw if the refresh token is expired', async () => {
        const res = await getResponse(generateExpiredToken());
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    it('should throw if the refresh token is invalid', async () => {
        const res = await getResponse(INVALID_TOKEN);
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    it('should throw if the token is invalid', async () => {
        const res = await getResponse(
            PortalHelper.generateRefreshToken(null),
            INVALID_TOKEN
        );
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    it('should throw if the token is not expired', async () => {
        const res = await getResponse(
            PortalHelper.generateRefreshToken(null),
            PortalHelper.generateToken(null, null)
        );
        expect(res.status).toBe(NetworkStatus.NOT_ACCEPTABLE);
    });
    it('should not throw if the token is expired', async () => {
        const userUtiltiy = new UserUtilityFixture();
        await userUtiltiy.createUser();
        const res = await getResponse(
            PortalHelper.generateRefreshToken(userUtiltiy.user.id),
            generateExpiredToken()
        );
        expect(res.status).toBe(NetworkStatus.OK);
    });
    // it.todo('should retrun with valid token and refresh token', async () => {
    //     const userUtility = new UserUtilityFixture();
    //     const user = await userUtility.createUser();
    //     // TODO: Replace them with fixture function to check if it has a value
    //     expect(user).toHaveProperty('token');
    //     expect(user).toHaveProperty('refreshToken');
    //     const res = await getResponse(
    //         PortalHelper.generateRefreshToken(null),
    //         PortalHelper.generateToken(null, null)
    //     );
    //     expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    // });
});

describe('Login should success when', () => {
    it.todo('Token is valid');
    it.todo('Token has the appropriate schema');
});

// TODO: Move it to fixture folder
export function expectValueToHaveProperty<T>(value: T, property: string) {

}
