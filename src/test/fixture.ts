import { superAgent } from './supertest';
import { Constants } from '@core/helpers';
import { sign } from 'jsonwebtoken';

const usersUri = `/api/${Constants.Endpoints.USERS}`;
const user = {
    id: null,
    token: null
};
export async function createUser() {
    const req = (await superAgent).post(usersUri);
    req.send({
        email: 'test@test.com',
        password: '123456789',
        username: 'test',
        mobile: '+962792807794'
    });
    const res = await req;
    user.id = res.body.data._id;
    user.token = sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    return user;
}

export async function deleteUser() {
    const req = (await superAgent).delete(`${usersUri}/${user.id}`);
    const res = await req.set('Authorization', user.token);
    return res.body;
}
