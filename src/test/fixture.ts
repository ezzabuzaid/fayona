import { superAgent } from './supertest';
import { Constants, tokenService } from '@core/helpers';
import { UsersSchema, ERoles } from '@api/users';
import { Body } from '@lib/mongoose';
import * as faker from 'faker';
import { ValidationPatterns } from '@shared/common';
import { ApplicationConstants } from '@core/constants';
import { AppUtils } from '@core/utils';

export const defaultHeaders = {
    [ApplicationConstants.deviceIdHeader]: faker.random.uuid(),
    Authorization: tokenService.generateToken({ id: '' })
};

export function getUri(value: string) {
    return `/api/${value}`;
}

export async function sendRequest<T>(endpoint: string, body: T, headers = {}) {
    const req = (await superAgent).post(endpoint);
    return req.send(body as any).set({
        ...defaultHeaders,
        ...headers,
    });
}

export async function deleteRequest(endpoint: string, id: string, headers = {}) {
    const request = (await superAgent).delete(`${endpoint}/${id}`);
    return request.set({
        ...defaultHeaders,
        ...headers,
    });
}

export async function getRequest(endpoint: string) {
    return (await superAgent).get(endpoint);
}

export function generateExpiredToken() {
    return tokenService.generateToken({} as any, { expiresIn: '-10s' });
}

export class UserFixture {
    public user = {
        id: null,
        token: null
    };
    private usersUri = getUri(Constants.Endpoints.USERS);

    public async createUser(body: Partial<Body<UsersSchema>> = {}) {
        const response = await sendRequest<Body<UsersSchema>>(this.usersUri, {
            email: faker.internet.email(),
            username: generateUsername(),
            mobile: generatePhoneNumber(),
            password: faker.internet.password(),
            verified: false,
            role: ERoles.ADMIN,
            profile: null,
            ...body
        });
        try {
            this.user.id = response.body.data.id;
        } catch (error) {

        }
        return response;
    }
    public async deleteUser(id = this.user.id) {
        if (AppUtils.not(id)) { return; }
        return deleteRequest(this.usersUri, id);
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
