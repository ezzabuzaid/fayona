import { superAgent } from './supertest';
import { Constants, tokenService } from '@core/helpers';

export function getUri(value: string) {
    return `/api/${value}`;
}

export async function sendRequest<T>(endpoint: string, body: T) {
    const req = (await superAgent).post(endpoint);
    return await req.send(body as any);
}

export function generateExpiredToken() {
    return tokenService.generateToken(null, { expiresIn: 1 });
}

export class UserUtilityFixture {
    private user = {
        id: null,
        token: null
    };
    private usersUri = getUri(Constants.Endpoints.USERS);

    constructor(seed = {}) {

    }

    public async  createUser() {
        const res = await sendRequest(this.usersUri, {
            email: `test@test.com`,
            password: '123456789',
            username: `test`,
            mobile: '+962792807794'
        });

        this.user.id = res.body.data._id;
        this.user.token = tokenService.generateToken(this.user.id);
        return this.user;
    }
    public async  deleteUser() {
        if (!this.user.id) { return; }
        const req = (await superAgent).delete(`${this.usersUri}/${this.user.id}`);
        const res = await req.set('Authorization', this.user.token);
        return res.body;
    }

}
