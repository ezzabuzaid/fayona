import { UsersSchema, ERoles } from '@api/users';
import { Body } from '@lib/mongoose';
import { Constants, NetworkStatus } from '@core/helpers';
import { getUri, generateExpiredToken, UserFixture, sendRequest, generateUsername } from '@test/fixture';
import { IRefreshTokenBody, ILogin } from './portal.routes';
import { PortalHelper } from './portal.helper';
import * as faker from 'faker';
import { ApplicationConstants } from '@core/constants';

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

const fakeLoginPaylod: ILogin = {
    password: faker.internet.password(),
    username: generateUsername(),
}
describe('[INTERGRATION]', () => {
    describe('Login should', () => {
        fdescribe('fail if..', () => {
            it('the request does not contain device_uuid', async () => {
                const response = await sendRequest(LOGIN_ENDPOINT, fakeLoginPaylod, {
                    [ApplicationConstants.deviceIdHeader]: undefined
                });
                expect(response.status).toMatch('not_allowed');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            it('Request with non existing user', async () => {
                const response = await sendRequest(LOGIN_ENDPOINT, fakeLoginPaylod);
                expect(response.status).toMatch('Wrong credintals');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            it('password is wrong', async () => {
                const userFixture = new UserFixture();
                const user = await userFixture.createUser(fakeLoginPaylod);
                console.log(user.body);
                const response = await sendRequest(LOGIN_ENDPOINT, fakeLoginPaylod);
                expect(response.status).toMatch('Wrong credintals');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            it.todo('User has more than three session');
        });

    })

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
        const userUtiltiy = new UserFixture();
        const user = await userUtiltiy.createUser();
        console.log(user);
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
