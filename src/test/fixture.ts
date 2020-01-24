import { superAgent } from './supertest';
import { Constants, tokenService } from '@core/helpers';
import { UsersSchema, ERoles } from '@api/users';
import { Body } from '@lib/mongoose';
import * as faker from 'faker';
import { ValidationPatterns } from '@shared/common';

export function getUri(value: string) {
    return `/api/${value}`;
}

export async function sendRequest<T>(endpoint: string, body: T) {
    const req = (await superAgent).post(endpoint);
    return req.send(body as any);
}

export async function deleteRequest(endpoint: string, id: string) {
    return (await superAgent).delete(endpoint);
}

export async function getRequest(endpoint: string) {
    return (await superAgent).get(endpoint);
}

export function generateExpiredToken() {
    return tokenService.generateToken({} as any, { expiresIn: '-10s' });
}

export class UserUtilityFixture {
    public user = {
        id: null,
        token: null
    };
    private usersUri = getUri(Constants.Endpoints.USERS);

    constructor(seed = {}) { }

    public async  createUser(body: Partial<Body<UsersSchema>> = {}) {
        const res = await sendRequest<Body<UsersSchema>>(this.usersUri, {
            email: `test@test.com`,
            password: '123456789',
            username: `test`,
            mobile: '+962792807794',
            role: ERoles.SUPERADMIN,
            profile: null,
            verified: null,
            ...body
        });
        console.log(res.body);
        this.user.id = res.body.data.id;
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

export function generatePhoneNumber(dialCode = 962) {
    return `+${dialCode}792${Math.floor(Math.random() * 899999 + 100000)}`;
}

export function generateUsername() {
    const username = faker.internet.userName();
    const noSpecialChar = ValidationPatterns.NoSpecialChar.test(username);
    return noSpecialChar ? username : generateUsername();
}
