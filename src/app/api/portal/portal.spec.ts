import { Constants } from '@core/helpers';
import {
    UserFixture, generateUsername, generateExpiredToken,
    prepareUserSession, generateDeviceUUIDHeader, getUri, generateToken
} from '@test/fixture';
import { LoginPayload, RefreshTokenPayload } from './portal.routes';
import { PortalHelper } from './portal.helper';
import { AppUtils } from '@core/utils';
import * as faker from 'faker';
import { ApplicationConstants } from '@core/constants';
import { Types } from 'mongoose';
import { PrimaryKey } from '@lib/mongoose';

const ENDPOINT = (suffix: string) => `${Constants.Endpoints.PORTAL}/${suffix}`;
const LOGIN_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.LOGIN));
const REFRESH_TOKEN = getUri(ENDPOINT(Constants.Endpoints.REFRESH_TOKEN));
const RESET_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.RESET_PASSWORD));
const FORGET_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.FORGET_PASSWORD));
const LOGUT_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.LOGOUT));

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

                // NOTE prepareUserSession will make a login request
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

    describe('Refresh Token', () => {
        const performRequest = (refreshToken: string, token: string = null, headers = null) => {
            const payload = new RefreshTokenPayload();
            payload.refreshToken = refreshToken;
            payload.token = token;
            return global.superAgent
                .post(REFRESH_TOKEN)
                .set(headers ?? generateDeviceUUIDHeader())
                .send(payload);
        };

        const INVALID_TOKEN = 'not.valid.token';

        test('should be UNAUTHORIZED if the refresh token is expired', async () => {
            const response = await performRequest(generateExpiredToken());
            expect(response.unauthorized).toBeTruthy();
        });

        test('should be UNAUTHORIZED if the refresh token is invalid', async () => {
            const response = await performRequest(INVALID_TOKEN);
            expect(response.unauthorized).toBeTruthy();
        });

        test('should be UNAUTHORIZED if the token is invalid', async () => {
            const response = await performRequest(
                PortalHelper.generateRefreshToken(new PrimaryKey()),
                INVALID_TOKEN
            );
            expect(response.unauthorized).toBeTruthy();
        });

        test('should be UNAUTHORIZED if the device_uuid invalid', async () => {
            const response = await performRequest(
                generateToken(),
                generateToken(),
                {}
            );
            expect(response.unauthorized).toBeTruthy();
        });

        test('should return BAD_REQUEST status and `not_allowed` if the token is not expired', async () => {
            const session = await prepareUserSession();

            const response = await performRequest(session.refreshToken, session.token);

            expect(response.body.message).toMatch('not_allowed');
            expect(response.badRequest).toBeTruthy();
        });

        test('should be UNAUTHORIZED if there is no asocciated session with the device uuid and user_id', async () => {
            const session = await prepareUserSession();

            const response = await performRequest(session.refreshToken, generateExpiredToken());

            expect(response.unauthorized).toBeTruthy();
        });

        test('should retrun new refresh token and access token', async () => {
            const session = await prepareUserSession();

            const response = await performRequest(session.refreshToken, generateExpiredToken(), session.headers);

            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.ok).toBeTruthy();
        });
    });

    describe('LOGOUT', () => {
        test('should deactive user session', async () => {
            const session = await prepareUserSession();

            const response = await global.superAgent
                .post(LOGUT_ENDPOINT)
                .send({ [ApplicationConstants.deviceIdHeader]: session.headers['x-device-uuid'] });

            expect(response.ok).toBeTruthy();
        });
        test('should return bad request if the device uuid was not specifed', async () => {
            const response = await global.superAgent
                .post(LOGUT_ENDPOINT);

            expect(response.body.message).toMatch('cannot logout unknown users');
            expect(response.badRequest).toBeTruthy();
        });

        test('should return bad request if the device uuid does not belong to any user', async () => {
            const response = await global.superAgent
                .post(LOGUT_ENDPOINT)
                .send(generateDeviceUUIDHeader());

            expect(response.body.message).toMatch('cannot logout unknown users');
            expect(response.badRequest).toBeTruthy();
        });

    });

});

describe('Forgot password ', () => {
    it.todo('refactor');
});

describe('Reset password ', () => {
    it.todo('refactor');
});
