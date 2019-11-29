import { superAgent } from './supertest';
import { Constants } from '@core/helpers';
import { sign } from 'jsonwebtoken';
import { ThenArg } from '@core/utils';

const usersUri = getUri(Constants.Endpoints.USERS);
const user = {
    id: null,
    token: null
};

export function getUri(value: string) {
    return `/api/${value}`;
}
export async function createUser() {
    const req = (await superAgent).post(usersUri);
    const res = await req.send({
        email: `test@test.com`,
        password: '123456789',
        username: `test`,
        mobile: '+962792807794'
    });
    user.id = res.body.data._id;
    user.token = sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    return user;
}

export async function deleteUser() {
    if (!user.id) { return; }
    const req = (await superAgent).delete(`${usersUri}/${user.id}`);
    const res = await req.set('Authorization', user.token);
    return res.body;
}

export type UserFixture = ThenArg<ReturnType<typeof createUser>>;
