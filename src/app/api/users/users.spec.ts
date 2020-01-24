import '@test/index';
import { getUri, sendRequest, deleteRequest, generatePhoneNumber } from '@test/fixture';
import { Constants, NetworkStatus } from '@core/helpers';
import { Body } from '@lib/mongoose';
import { UsersSchema, ERoles } from './users.model';
import { AppUtils } from '@core/utils';
import * as faker from 'faker';

const ENDPOINT = getUri(Constants.Endpoints.USERS);
const user = (body: Partial<Body<UsersSchema>> = {}) => ({
    email: faker.internet.email(),
    password: '123456789',
    profile: null,
    role: ERoles.ADMIN,
    username: `${AppUtils.generateAlphabeticString()}TestCreate`,
    ...body
} as Body<UsersSchema>);

describe('[INTERGRATION]', () => {

    // NOTE test the fail then test the success
    fdescribe('#CREATE USER', () => {
        fdescribe('Should fail if', () => {
            fit('username exist before', async () => {
                const username = faker.internet.userName();
                await sendRequest<Body<UsersSchema>>(ENDPOINT, {
                    username,
                    email: faker.internet.email(),
                    mobile: generatePhoneNumber(),
                    password: faker.internet.password(),
                    verified: false,
                    role: ERoles.ADMIN,
                    profile: null
                });
                const response = await sendRequest<Body<UsersSchema>>(ENDPOINT, {
                    username,
                    email: faker.internet.email(),
                    mobile: generatePhoneNumber(),
                    password: faker.internet.password(),
                    verified: false,
                    role: ERoles.ADMIN,
                    profile: null
                });
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('should fail if username contains special char', async () => {
                const res = await sendRequest(ENDPOINT, user({ username: 'testCreate2#$' }));
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('should fail if mobile number is wrong', async () => {
                const res = await sendRequest(ENDPOINT, user({ mobile: '0792807794' }));
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('should fail if the role is not one of supported roles', async () => {
                const res = await sendRequest(ENDPOINT, user({ role: 100000 }));
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
        });

        describe('should pass if', () => {
            test('should pass if mobile number is correct', async () => {
                const res = await sendRequest(ENDPOINT, user({ mobile: '+962792807794' }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
            test('should pass if the role is one of supported roles', async () => {
                const res = await sendRequest(ENDPOINT, user({ role: ERoles.ADMIN }));
                expect(res.status).toBe(NetworkStatus.CREATED);

            });
        });

        test.todo('user should have a defualt profile equal to empty {}');
        // test('Profile Should have an empty object when creating a new user', async () => {
        //     const req = (await superAgent).post(ENDPOINT);
        //     const res = await req.send(user);
        //     expect(((res.body) as Body<UsersSchema>).profile).toBe(undefined);
        //     // TODO: the profile object should has a default value in the service
        //              and not in model, then uncomment the below code
        //     // expect(((res.body) as Body<UsersSchema>).profile).toMatchObject({});
        //     expect(res.status).toBe(NetworkStatus.CREATED);
        // });

    });

    describe('#GET USER', () => {
        test.todo(`user body should contain only id`);
        test.todo(`make sure that the user is not created if the email is exist or username or mobile`);
    });

});
