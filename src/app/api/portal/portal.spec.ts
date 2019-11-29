import { UsersSchema, ERoles } from '@api/users';
import { Body } from '@lib/mongoose';
import { superAgent } from '@test/index';
import { Constants, NetworkStatus } from '@core/helpers';
import { UserFixture as userFixture, getUri } from '@test/fixture';
import { AppUtils } from '@core/utils';

const ENDPOINT = (suffix: string) => getUri(`${Constants.Endpoints.PORTAL}/${suffix}`);
const LOGIN_ENDPOINT = ENDPOINT(Constants.Endpoints.LOGIN);
const RESET_ENDPOINT = ENDPOINT(Constants.Endpoints.RESET_PASSWORD);
const FORGET_ENDPOINT = ENDPOINT(Constants.Endpoints.FORGET_PASSWORD);

const mockUser = {
    password: '123456789',
    username: 'portalLogin',
    email: 'portal@login.com',
    mobile: '0792807794',
    profile: null,
    role: ERoles.SUPERADMIN
} as Body<UsersSchema>;
// let userFixture: userFixture = null;

beforeAll(async () => {
    // const req = (await superAgent).post(ENDPOINT);
    // const res = await req.send(mockUser);
    // userFixture = res.body.data;
});

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

describe('Login should success when', () => {
    it.todo('Token is valid');
    it.todo('Token has the appropriate schema');
});
