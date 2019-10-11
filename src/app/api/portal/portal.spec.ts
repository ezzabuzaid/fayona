import { UsersSchema } from '@api/users';
import { Body } from '@lib/mongoose';
import { superAgent } from '@test/index';
import { Constants, NetworkStatus } from '@core/helpers';
import { UserFixture } from '@test/fixture';

const ENDPOINT = `/api/${Constants.Endpoints.PORTAL}/login/${Constants.Endpoints.USERS}/`;

let user: UserFixture = null;

beforeAll(async () => {
    const body = {
        password: '123456789',
        username: 'portalLogin',
        email: 'portal@login.com',
        mobile: '0792807794'
    } as Body<UsersSchema>;
    const req = (await superAgent).post(ENDPOINT);
    const res = await req.send(body);
    user = res.body.data;
});

describe('Login should fail if..', () => {
    it('`Request with non existing user`', async () => {
        const body = {
            password: '123456789',
            username: 'portalLogin'
        } as Body<UsersSchema>;
        const req = (await superAgent).post(ENDPOINT);
        const res = await req.send(body);
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    it.todo('The Username was wrong');
    it.todo('The password was wrong');
    it.todo('User trying to login with an old password');
    it.todo('User has more than three session');
});

describe('Login should success when', () => {
    it.todo('Token is valid');
    it.todo('Token has the appropriate schem');
});
