import { Constants, NetworkStatus } from '@core/helpers';
import { UserFixture, sendRequest, generateUsername, generateExpiredToken, generateToken } from '@test/fixture';
import { IRefreshTokenBody, ILogin } from './portal.routes';
import { PortalHelper } from './portal.helper';
import * as faker from 'faker';
import { ApplicationConstants } from '@core/constants';
import { AppUtils } from '@core/utils';

const ENDPOINT = (suffix: string) => `${Constants.Endpoints.PORTAL}/${suffix}`;
const LOGIN_ENDPOINT = ENDPOINT(Constants.Endpoints.LOGIN);
const RESET_ENDPOINT = ENDPOINT(Constants.Endpoints.RESET_PASSWORD);
const FORGET_ENDPOINT = ENDPOINT(Constants.Endpoints.FORGET_PASSWORD);
const REFRESH_TOKEN = ENDPOINT(Constants.Endpoints.REFRESH_TOKEN);

const fakeLoginPaylod: ILogin = {
    password: faker.internet.password(),
    username: generateUsername(),
};

describe('[INTERGRATION]', () => {
    describe('Login should', () => {
        describe('fail if..', () => {

            test('Request with non existing user', async () => {
                const response = await sendRequest(LOGIN_ENDPOINT, fakeLoginPaylod, {
                    authorization: generateToken()
                });
                expect(response.body.message).toMatch('Wrong credintals');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            test('password is wrong', async () => {
                const userFixture = new UserFixture();
                await userFixture.createUser(fakeLoginPaylod);
                const response = await sendRequest(
                    LOGIN_ENDPOINT,
                    AppUtils.assignObject(fakeLoginPaylod, { password: faker.internet.password() })
                );
                expect(response.body.message).toMatch('Wrong credintals');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            it.todo('User has more than three session');
        });
    });

    describe('Login should', () => {
        describe('success if..', () => {
            test.todo('if request came with valid device_uuid');
            test.todo('if request came with non falsy username');
            test.todo('if request came with non falsy password');
        });
    });

});

describe('Forgot password ', () => {
    it.todo('refactor');
});

describe('Reset password ', () => {
    it.todo('refactor');
});

describe('Refresh Token', () => {
    const getResponse = (refreshToken: string, token: string = null, device_uuid = null) => {
        return sendRequest(
            REFRESH_TOKEN,
            { refreshToken, token } as IRefreshTokenBody,
            { [ApplicationConstants.deviceIdHeader]: device_uuid }
        );
    };

    const INVALID_TOKEN = 'invalid.token.refuesed';

    test('should be UNAUTHORIZED if the refresh token is expired', async () => {
        const response = await getResponse(generateExpiredToken());
        expect(response.status).toBe(NetworkStatus.UNAUTHORIZED);
    });

    test('should be UNAUTHORIZED if the refresh token is invalid', async () => {
        const response = await getResponse(INVALID_TOKEN);
        expect(response.status).toBe(NetworkStatus.UNAUTHORIZED);
    });

    test('should be UNAUTHORIZED if the token is invalid', async () => {
        const response = await getResponse(
            PortalHelper.generateRefreshToken(null),
            INVALID_TOKEN
        );
        expect(response.status).toBe(NetworkStatus.UNAUTHORIZED);
    });

    test.skip('should be UNAUTHORIZED if the device_uuid invalid', async () => {
        const response = await getResponse(
            generateToken(),
            generateToken()
        );
        expect(response.body.message).toBe('not_authorized');
        expect(response.status).toBe(NetworkStatus.UNAUTHORIZED);
    });

    test.skip('should return BAD_REQUEST status and `not_allowed` if the token is not expired', async () => {
        const response = await getResponse(
            generateToken(),
            generateToken(),
            'some_device_uuid'
        );
        expect(response.body.message).toMatch('not_allowed');
        expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    test.skip('should not throw if the token is expired', async () => {
        const userUtiltiy = new UserFixture();
        await userUtiltiy.login();
        const response = await getResponse(
            PortalHelper.generateRefreshToken(userUtiltiy.user.id),
            generateExpiredToken()
        );
        expect(response.status).toBe(NetworkStatus.OK);
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
    it.todo('returned Token is valid');
    it.todo('returned Token has the appropriate schema');
});
