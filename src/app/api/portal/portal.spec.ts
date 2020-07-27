import { Constants } from '@core/helpers';
import { generateExpiredToken, generateDeviceUUIDHeader, getUri, generateToken, createApplicationUser, login } from '@test/fixture';
import { CredentialsDto, RefreshTokenDto, PortalRoutes } from './portal.routes';
import { AppUtils } from '@core/utils';
import { tokenService, ITokenClaim, IClaim } from '@shared/identity';
import { isMongoId } from 'class-validator';
import superAgent from '@test/superAgent';

const ENDPOINT = (suffix: string) => `${ Constants.Endpoints.PORTAL }/${ suffix }`;
const LOGIN_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.LOGIN));
const REFRESH_TOKEN = getUri(ENDPOINT(Constants.Endpoints.REFRESH_TOKEN));
const RESET_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.RESET_PASSWORD));
const FORGET_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.FORGET_PASSWORD));
const LOGUT_ENDPOINT = getUri(ENDPOINT(Constants.Endpoints.LOGOUT));

async function getLastSession(headers) {
    const sessionResponse = await superAgent
        .get(getUri(`${ Constants.Endpoints.SESSIONS }/${ Constants.Endpoints.USERS_SESSIONS }`))
        .set(headers);
    return AppUtils.lastElement(sessionResponse.body.data.list);
}

function createCredentials(username = 'fakeUsername', password = 'fakePassword') {
    const credentials = new CredentialsDto();
    credentials.password = password;
    credentials.username = username;
    return credentials;
}

function createRefreshToken(token: string = generateToken(), refreshToken: string = generateToken()) {
    const payload = new RefreshTokenDto();
    payload.refreshToken = refreshToken;
    payload.token = token;
    return payload;
}

function extractExpFromToken(token: IClaim) {
    return (token.exp - token.iat) / 60 / 60;
}

describe('#INTERGRATION', () => {
    describe('Login', () => {
        describe('WILL return failure results, WHEN...', () => {
            test('Request headers does not have a device_uuid', async () => {
                // Arrange
                const credentials = createCredentials();

                // Act
                const response = await superAgent
                    .post(LOGIN_ENDPOINT)
                    .send(credentials);

                // Assert
                expect(response.badRequest).toBeTruthy();
            });
            describe.each
                ([
                    { desc: 'not belong to any user', value: 'fakeUsername' },
                    { desc: 'null', value: null },
                    { desc: 'undefined', value: undefined },
                ])
                ('username is ', async (object) => {
                    test(`${ object.desc }`, async () => {
                        // Arrange
                        const credentials = createCredentials(object.value);

                        // Act
                        const response = await superAgent
                            .post(LOGIN_ENDPOINT)
                            .set(generateDeviceUUIDHeader())
                            .send(credentials);

                        // Assert
                        expect(response.badRequest).toBeTruthy();
                    });
                });
            describe.each
                ([
                    { desc: 'wrong password', value: 'fakePassword' },
                    { desc: 'null', value: null },
                    { desc: 'undefined', value: undefined },
                ])
                ('password is ', async (object) => {
                    test(`${ object.desc }`, async () => {
                        // Arrange
                        const credentials = createCredentials('fakeUseranme', object.value);
                        await createApplicationUser(credentials);

                        // Act
                        credentials.password = 'shitPassword';
                        const response = await superAgent
                            .post(LOGIN_ENDPOINT)
                            .set(generateDeviceUUIDHeader())
                            .send(credentials);

                        // Assert
                        expect(response.badRequest).toBeTruthy();
                    });
                });

            test('user has more than three active session', async () => {
                // Arrange
                const credentials = createCredentials('fakeUserName', 'fakePassword');
                await createApplicationUser(credentials);

                const session = await login(credentials);
                for (let index = 0; index < PortalRoutes.MAX_SESSION_SIZE - 1; index++) {
                    // Act
                    await superAgent
                        .post(LOGIN_ENDPOINT)
                        .set(session.headers)
                        .send(credentials);

                    await superAgent
                        .post(LOGIN_ENDPOINT)
                        .set(session.headers)
                        .send(credentials);
                }

                const lastSession = await superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(session.headers)
                    .send(credentials);

                // Assert
                expect(lastSession.body.message).toMatch('exceeded_allowed_sesison');
                expect(lastSession.badRequest).toBeTruthy();
            });
        });
        test(
            'WILL success WHEN username is belong to a user, password is correct and request has device uuid header',
            async () => {
                // Arrange
                const credentials = createCredentials();
                await createApplicationUser(credentials);
                // Act
                const response = await superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(generateDeviceUUIDHeader())
                    .send(credentials);

                // Assert
                expect(response.ok).toBeTruthy();
            });
        describe('WHEN succeed', () => {
            test('WILL return valid token and refresh token ', async () => {
                // Arrange
                const credentials = createCredentials();
                await createApplicationUser(credentials);

                // Act
                const response = await superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(generateDeviceUUIDHeader())
                    .send(credentials);

                // Assert
                expect(await tokenService.decodeToken(response.body.data.token)).toBeDefined();
                expect(await tokenService.decodeToken(response.body.data.refreshToken)).toBeDefined();
                expect(response.ok).toBeTruthy();
            });
            test('WILL return a refresh token that contains exp date set to 12 hours', async () => {
                // Arrange
                const credentials = createCredentials();
                await createApplicationUser(credentials);

                // Act
                const response = await superAgent
                    .post(LOGIN_ENDPOINT)
                    .set(generateDeviceUUIDHeader())
                    .send(credentials);
                const decodeToken = await tokenService.decodeToken(response.body.data.refreshToken);

                // Assert
                expect(extractExpFromToken(decodeToken)).toEqual(12);
            });

            describe('WILL return a token that contains the following claims', () => {
                let decodeToken: ITokenClaim;
                beforeEach(async () => {
                    // Arrange
                    const credentials = createCredentials();
                    await createApplicationUser(credentials);

                    // Act
                    const response = await superAgent
                        .post(LOGIN_ENDPOINT)
                        .set(generateDeviceUUIDHeader())
                        .send(credentials);
                    decodeToken = await tokenService.decodeToken(response.body.data.token);

                });
                test('role', async () => {
                    expect(decodeToken.role).toMatch('ADMIN');
                });
                test('id of type mongo object ID', async () => {
                    expect(isMongoId(decodeToken.id)).toBeTruthy();
                });

                test('expiration date set to 6 hours', async () => {
                    expect((decodeToken.exp - decodeToken.iat) / 60 / 60).toEqual(6);
                });
            });
            test('WILL create session entity', async () => {
                // Arrange
                const credentials = createCredentials();
                await createApplicationUser(credentials);
                const loginResponse = await login(credentials);

                // Act
                const response = await superAgent
                    .get(getUri(`${ Constants.Endpoints.SESSIONS }/${ Constants.Endpoints.USERS_SESSIONS }`))
                    .set(loginResponse.headers)
                    .send(credentials);

                // Assert
                expect(AppUtils.lastElement(response.body.data.list)).toBeDefined();
            });
        });
    });
    describe('Logout', () => {
        function logout(headers) {
            return superAgent
                .post(LOGUT_ENDPOINT)
                .set(headers);
        }
        it('WILL return failure result WHEN device uuid is not exist in the request headers', async () => {
            // Act
            const response = await logout({});

            // Assert
            expect(response.badRequest).toBeTruthy();
        });
        it('WILL return failure result WHEN device uuid is not associated with any session', async () => {
            // Act
            const response = await logout(generateDeviceUUIDHeader());

            // Assert
            expect(response.badRequest).toBeTruthy();
        });
        it('WILL deactive the associated session with device uuid WHEN there is one available', async () => {
            // Arrange
            const credentials = createCredentials();
            await createApplicationUser(credentials);
            const loginResponse = await login(credentials);

            // Act
            const response = await logout(loginResponse.headers);

            // Assert
            const sessions = await superAgent
                .get(getUri(`${ Constants.Endpoints.SESSIONS }/${ Constants.Endpoints.USERS_SESSIONS }`))
                .set(loginResponse.headers)
                .send(credentials);
            expect(AppUtils.lastElement(sessions.body.data.list).active).toBeFalsy();
            expect(response.ok).toBeTruthy();
        });
    });
    describe('Refresh Token', () => {
        function refreshToken(payload, headers) {
            return superAgent
                .post(REFRESH_TOKEN)
                .set(headers)
                .send(payload);
        }
        test('WILL return failure bad request result WHEN device uuid is missing from the request header', async () => {
            // Arrange
            const payload = createRefreshToken('token.token.token', 'token.token.token');

            // Act
            const response = await superAgent
                .post(REFRESH_TOKEN)
                .set({})
                .send(payload);

            // Assert
            expect(response.badRequest).toBeTruthy();
        });

        describe.each
            ([
                { desc: null, token: null, refreshToken: 'token.token.token', type: 'token' },
                { desc: null, token: 'token.token.token', refreshToken: null, type: 'refresh token' },
                { desc: 'empty string', token: '', refreshToken: 'token.token.token', type: 'token' },
                { desc: 'empty string', token: 'token.token.token', refreshToken: '', type: 'refresh token' },
                { desc: undefined, token: undefined, refreshToken: 'token.token.token', type: 'token' },
                { desc: undefined, token: 'token.token.token', refreshToken: undefined, type: 'refresh token' },
            ])
            ('WILL return failure bad request result WHEN...', (object) => {
                test(`the ${ object.type } has wrong format like ${ object.desc }`, async () => {
                    // Arrange
                    const payload = createRefreshToken(object.token);

                    // Act
                    const response = await refreshToken(payload, generateDeviceUUIDHeader());

                    // Assert
                    expect(response.badRequest).toBeTruthy();
                });
            });
        test('WILL return failure bad request result WHEN the token is not yet expired', async () => {
            // Arrange
            const payload = createRefreshToken();

            // Act
            const response = await superAgent
                .post(REFRESH_TOKEN)
                .set(generateDeviceUUIDHeader())
                .send(payload);

            // Assert
            expect(response.badRequest).toBeTruthy();
        });
        test(
            'WILL deactivate the associated session WHEN the refresh token is expired, not valid or wrong in general',
            async () => {
                // Arrange
                const credentials = createCredentials();
                await createApplicationUser(credentials);
                const loginResponse = await login(credentials);
                const payload = createRefreshToken(
                    generateToken(),
                    generateExpiredToken()
                );

                // Act
                const response = await superAgent
                    .post(REFRESH_TOKEN)
                    .set(loginResponse.headers)
                    .send(payload);

                const sessionResponse = await superAgent
                    .get(getUri(`${ Constants.Endpoints.SESSIONS }/${ Constants.Endpoints.USERS_SESSIONS }`))
                    .set(loginResponse.headers)
                    .send(credentials);

                // Assert
                expect(AppUtils.lastElement(sessionResponse.body.data.list).active).toBeFalsy();
                expect(response.badRequest).toBeTruthy();
            }
        );

        describe.each
            ([{ type: 'token', exp: 6 }, { type: 'refreshToken', exp: 12 }])
            ('WILL return WHEN request succeed', (value) => {
                test(`New ${ value.type }`, async () => {
                    // Arrange
                    const credentials = createCredentials();
                    await createApplicationUser(credentials);
                    const loginResponse = await login(credentials);
                    const payload = createRefreshToken(generateExpiredToken(), loginResponse[value.type]);

                    // Act
                    const response = await refreshToken(payload, loginResponse.headers);

                    // Asssert
                    expect(await tokenService.decodeToken(response.body.data[value.type])).toBeDefined();
                    expect(response.ok).toBeTruthy();
                });
                test(`with ${ value.exp } hours exp time`, async () => {
                    // Arrange
                    const credentials = createCredentials();
                    await createApplicationUser(credentials);
                    const loginResponse = await login(credentials);
                    const payload = createRefreshToken(generateExpiredToken(), loginResponse[value.type]);

                    // Act
                    const response = await refreshToken(payload, loginResponse.headers);

                    // Assert
                    const decodeToken = await tokenService.decodeToken(response.body.data[value.type]);
                    expect(extractExpFromToken(decodeToken)).toEqual(value.exp);
                    expect(response.ok).toBeTruthy();
                });
            });
        test(
            'WILL return failure bad requrest result WHEN there is no associated session with the device_uuid',
            async () => {
                // Arrange
                const payload = createRefreshToken(generateExpiredToken());

                // Act
                const response = await refreshToken(payload, generateDeviceUUIDHeader());

                // Arrange
                expect(response.badRequest).toBeTruthy();
            });
        test('WILL update associated session updatedAt column WHEN there is available session', async () => {
            // Arrange
            const credentials = createCredentials();
            await createApplicationUser(credentials);
            const loginResponse = await login(credentials);
            const updatedAt = (await getLastSession(loginResponse.headers)).updatedAt;
            const payload = createRefreshToken(generateExpiredToken(), loginResponse.refreshToken);

            // Act
            const response = await refreshToken(payload, loginResponse.headers);

            // Assert
            expect((await getLastSession(loginResponse.headers)).updatedAt).not.toEqual(updatedAt);
            expect(response.ok).toBeTruthy();
        });
    });
    xdescribe('Forgot password ', () => {
        test.todo('refactor');
    });
    xdescribe('Reset password ', () => {
        test.todo('refactor');
    });
});
