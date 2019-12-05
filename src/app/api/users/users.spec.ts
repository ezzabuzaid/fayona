import '@test/index';
import { superAgent } from '@test/supertest';
import { getUri, UserUtilityFixture, sendRequest } from '@test/fixture';
import { Constants, NetworkStatus } from '@core/helpers';
import { Body } from '@lib/mongoose';
import { UsersSchema, ERoles } from './users.model';
import { AppUtils } from '@core/utils';

const ENDPOINT = getUri(Constants.Endpoints.USERS);

const user = {
    email: `${Math.log2(Math.random())}test@create.com`,
    mobile: `${Math.round(Math.random())}792807794`,
    password: '123456789',
    profile: null,
    role: ERoles.ADMIN,
    username: `${Math.log2(Math.random())}TestCreate`
} as Body<UsersSchema>;

// NOTE test the fail, don't test the success
describe('#CREATE USER', () => {
    test('Fail if the user exist before', async () => {
        await sendRequest(ENDPOINT, user);
        const res2 = await sendRequest(ENDPOINT, user);
        expect(res2.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    test('Special Char is not allowed', async () => {
        const res = await sendRequest(ENDPOINT, AppUtils.assignObject({}, user, { username: 'testCreate2#$' }));
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    test('Mobile number shouldnt be wrong', async () => {
        const res = await sendRequest(ENDPOINT, AppUtils.assignObject({}, user, { mobile: '079280779' }));
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    test('Fail if user role is not one of supported roles', async () => {
        const res = await sendRequest(ENDPOINT, AppUtils.assignObject({}, user, { role: 100000 }));
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
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
    test.todo(`user body shouldn't have a password`);
});
