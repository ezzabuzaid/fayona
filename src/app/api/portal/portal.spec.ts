import { Constants } from '@core/helpers';
import {
    UserFixture, generateUsername, generateExpiredToken,
    prepareUserSession, generateDeviceUUIDHeader, getUri
} from '@test/fixture';
import { LoginPayload } from './portal.routes';
import { PortalHelper } from './portal.helper';
import { AppUtils } from '@core/utils';
import * as faker from 'faker';

const ENDPOINT = (suffix: string) => `${Constants.Endpoints.PORTAL}/${suffix}`;
const LOGIN_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.LOGIN));
const REFRESH_TOKEN = getUri(ENDPOINT(Constants.Endpoints.REFRESH_TOKEN));
const RESET_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.RESET_PASSWORD));
const FORGET_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.FORGET_PASSWORD));

const fakeLoginPaylod: LoginPayload = {
    password: faker.internet.password(),
    username: generateUsername(),
};

describe('#INTERGRATION', () => {
    fdescribe('Login should', () => {
        describe('fail if..', () => {
            test('user not exist, aka username is wrong', async () => {
                const response = await global.superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(generateDeviceUUIDHeader())
                    .send(fakeLoginPaylod);

                expect(response.body.message).toMatch('Wrong credintals');
                expect(response.badRequest).toBeTruthy();
            });

            test('password is wrong', async () => {
                const userFixture = new UserFixture();
                await userFixture.createUser(fakeLoginPaylod);
                const response = await global.superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(generateDeviceUUIDHeader())
                    .send(AppUtils.extendObject(fakeLoginPaylod, { password: faker.internet.password() }));

                expect(response.body.message).toMatch('Wrong credintals');
                expect(response.badRequest).toBeTruthy();
            });

            test('request headers does not have a device_uuid', async () => {
                const response = await global.superAgent
                    .post(LOGIN_ENDPOINT);
                expect(response.unauthorized).toBeTruthy();
            });

            test('user has more than three active session', async () => {
                const userFixture = new UserFixture();
                await userFixture.createUser(fakeLoginPaylod);

                const session = await prepareUserSession({
                    _id: userFixture.user.id,
                    ...fakeLoginPaylod
                });

                await global.superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(session.headers)
                    .send(fakeLoginPaylod);

                await global.superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(session.headers)
                    .send(fakeLoginPaylod);

                const lastSession = await global.superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(session.headers)
                    .send(fakeLoginPaylod);

                expect(lastSession.body.message).toMatch('exceed_allowed_sesison');
                expect(lastSession.unauthorized).toBeTruthy();
            });

        });
        describe('success if', () => {
            test('username and password is right, request has device uuid header', async () => {
                const userFixture = new UserFixture();
                await userFixture.createUser(fakeLoginPaylod);
                const response = await global.superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(generateDeviceUUIDHeader())
                    .send(fakeLoginPaylod);

                expect(response.ok).toBeTruthy();
            });
        });
        test.todo('returned Token is valid');
        test.todo('returned Token has the appropriate schema');
    });

    xdescribe('Refresh Token', () => {
        const performRequest = (refreshToken: string, token: string = null) => {
            return global.superAgent
                .post(REFRESH_TOKEN)
                .set(generateDeviceUUIDHeader())
                .send({ refreshToken, token });
        };

        const INVALID_TOKEN = 'not.valid.token';

        test.only('should be UNAUTHORIZED if the refresh token is expired', async () => {
            const response = await performRequest(generateExpiredToken());
            expect(response.unauthorized).toBeTruthy();
        });

        test('should be UNAUTHORIZED if the refresh token is invalid', async () => {
            const response = await performRequest(INVALID_TOKEN);
            expect(response.unauthorized).toBeTruthy();
        });

        test('should be UNAUTHORIZED if the token is invalid', async () => {
            const response = await performRequest(
                PortalHelper.generateRefreshToken(null),
                INVALID_TOKEN
            );
            expect(response.unauthorized).toBeTruthy();
        });

        // test.skip('should be UNAUTHORIZED if the device_uuid invalid', async () => {
        //     const response = await getResponse(
        //         generateToken(),
        //         generateToken()
        //     );
        //     expect(response.body.message).toBe('not_authorized');
        //     expect(response.unauthorized).toBeTruthy();
        // });

        // test.skip('should return BAD_REQUEST status and `not_allowed` if the token is not expired', async () => {
        //     const response = await getResponse(
        //         generateToken(),
        //         generateToken(),
        //         'some_device_uuid'
        //     );
        //     expect(response.body.message).toMatch('not_allowed');
        //                     expect(response.badRequest).toBeTruthy();
        // });
        test.skip('should not throw if the token is expired', async () => {
            const userUtiltiy = new UserFixture();
            await prepareUserSession();
            const response = await performRequest(
                PortalHelper.generateRefreshToken(userUtiltiy.user.id),
                generateExpiredToken()
            );
            expect(response.ok).toBeTruthy();
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

});

describe('Forgot password ', () => {
    it.todo('refactor');
});

describe('Reset password ', () => {
    it.todo('refactor');
});
