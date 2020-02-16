import { Constants, tokenService } from '@core/helpers';
import { UsersSchema, ERoles } from '@api/users';
import { Body } from '@lib/mongoose';
import * as faker from 'faker';
import { ValidationPatterns } from '@shared/common';
import { ApplicationConstants } from '@core/constants';
import { AppUtils } from '@core/utils';

export function defaultHeaders() {
    return {
        [ApplicationConstants.deviceIdHeader]: faker.random.uuid()
    };
}

export function getUri(value: string) {
    return `/api/${value}`;
}

export function sendRequest<T>(endpoint: string, body: T, headers = {}) {
    return global.superAgent
        .post(getUri(endpoint))
        .send(body as any)
        .set({
            ...defaultHeaders(),
            ...headers,
        });
}

export function deleteRequest(endpoint: string, id: string, headers = {}) {
    return global.superAgent
        .delete(getUri(`${endpoint}/${id}`))
        .set({
            ...defaultHeaders(),
            ...headers,
        });
}

export function getRequest(endpoint: string) {
    return global.superAgent.get(getUri(endpoint)).send(defaultHeaders());
}

export class UserFixture {
    public user = {
        id: null,
        token: null
    };
    private usersEndpoint = Constants.Endpoints.USERS;

    public async createUser(body: Partial<Body<UsersSchema>> = {}) {
        const response = await sendRequest<Body<UsersSchema>>(this.usersEndpoint, {
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
        } catch (error) { }
        return response;
    }

    public async login() {
        const payload = {
            email: faker.internet.email(),
            username: generateUsername(),
            mobile: generatePhoneNumber(),
            password: faker.internet.password(),
        };
        try {
            await sendRequest<Body<Partial<UsersSchema>>>(this.usersEndpoint, payload);
            return sendRequest(Constants.Endpoints.LOGIN, payload);
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteUser(id = this.user.id) {
        if (AppUtils.isFalsy(id)) { return; }
        return deleteRequest(this.usersEndpoint, id);
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

export function generateExpiredToken() {
    return tokenService.generateToken({} as any, { expiresIn: '-10s' });
}

export function generateToken() {
    return tokenService.generateToken({ id: '' });
}
