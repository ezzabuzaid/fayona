import { superAgent } from './supertest';
import { Constants, tokenService } from '@core/helpers';
import { UsersSchema, ERoles } from '@api/users';
import { Body } from '@lib/mongoose';

export function getUri(value: string) {
    return `/api/${value}`;
}

export async function sendRequest<T>(endpoint: string, body: T) {
    const req = (await superAgent).post(endpoint);
    return await req.send(body as any);
}

export function generateExpiredToken() {
    return tokenService.generateToken({} as any, { expiresIn: '-10s' });
}

export class UserUtilityFixture {
    private user = {
        id: null,
        token: null
    };
    private usersUri = getUri(Constants.Endpoints.USERS);

    constructor(seed = {}) {

    }

    public async  createUser(body: Partial<Body<UsersSchema>> = {}) {
        const res = await sendRequest<Body<UsersSchema>>(this.usersUri, {
            email: `test@test.com`,
            password: '123456789',
            username: `test`,
            mobile: '+962792807794',
            profile: null,
            role: ERoles.SUPERADMIN,
            ...body
        });
        console.log(res.body);
        this.user.id = res.body.data._id;
        this.user.token = tokenService.generateToken(this.user.id);
        return res;
    }
    public async deleteUser(id = this.user.id) {
        if (!this.user.id) { return; }
        const req = (await superAgent).delete(`${this.usersUri}/${this.user.id}`);
        const res = await req.set('Authorization', this.user.token);
        return res;
    }

}
