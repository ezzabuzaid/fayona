import { Constants } from '@core/helpers';
import { UsersSchema } from '@api/users';
import { Payload, WithMongoID } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';
import { ApplicationConstants } from '@core/constants';
import { AppUtils } from '@core/utils';
import { CredentialsPayload } from '@api/portal';
import { tokenService } from '@shared/identity';
import * as faker from 'faker';
import { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

export function generateDeviceUUIDHeader() {
    return {
        [ApplicationConstants.deviceIdHeader]: faker.random.uuid()
    };
}

export function getUri(value: string) {
    return `/api/${ value }`;
}

export async function prepareUserSession(user?: WithMongoID<CredentialsPayload>) {
    const payload = user ?? {
        email: faker.internet.email(),
        username: generateUsername(),
        mobile: generatePhoneNumber(),
        password: faker.internet.password(),
    };

    let user_id = null;
    if (AppUtils.isFalsy(user)) {
        const { body: { data: { id } } } = await global.superAgent
            .post(getUri(Constants.Endpoints.USERS))
            .send(payload);
        user_id = id;
    } else {
        user_id = user._id;
    }

    const deviceUUIDHeader = generateDeviceUUIDHeader();
    const loginResponse = await global.superAgent
        .post(getUri(`${ Constants.Endpoints.PORTAL }/${ Constants.Endpoints.LOGIN }`))
        .set(deviceUUIDHeader)
        .send(payload);

    return {
        headers: {
            authorization: loginResponse.body.token,
            ...deviceUUIDHeader
        },
        user_id,
        session_id: loginResponse.body.session_id,
        token: loginResponse.body.token,
        refreshToken: loginResponse.body.refreshToken
    };
}

export class UserFixture {
    public user = {
        id: null,
        token: null
    };

    public async createUser(paylod: Partial<Payload<UsersSchema>> = {}) {
        const response = await global
            .superAgent
            .post(getUri(Constants.Endpoints.USERS))
            .set(generateDeviceUUIDHeader())
            .send({
                email: faker.internet.email(),
                username: generateUsername(),
                mobile: generatePhoneNumber(),
                password: faker.internet.password(),
                ...paylod
            });
        this.user.id = response.body.data.id;
        return response;
    }

}

export function generatePhoneNumber(dialCode = 962) {
    return `+${ dialCode }792${ Math.floor(Math.random() * 899999 + 100000) }`;
}

export function generateUsername() {
    const username = faker.internet.userName();
    const noSpecialChar = ValidationPatterns.NoSpecialChar.test(username);
    return noSpecialChar ? username : generateUsername();
}

export function generateExpiredToken() {
    return tokenService.generateToken({ id: AppUtils.generateRandomString() }, { expiresIn: -10 });
}

export function generateToken(options: SignOptions = {}) {
    return tokenService.generateToken({ id: new Types.ObjectId() }, options);
}
export async function createApplicationUser(payload: Partial<UsersSchema> = null) {
    const response = await global.superAgent
        .post(getUri(Constants.Endpoints.USERS))
        .set(generateDeviceUUIDHeader())
        .send({
            email: faker.internet.email(),
            username: generateUsername(),
            mobile: generatePhoneNumber(),
            password: faker.internet.password(),
            ...payload
        });
    return response.body.data as UsersSchema;
}

export async function login(credentials: CredentialsPayload, headers = generateDeviceUUIDHeader()) {

    const { body: { data } } = await global.superAgent
        .post(getUri(`${ Constants.Endpoints.PORTAL }/${ Constants.Endpoints.LOGIN }`))
        .set(headers)
        .send(credentials);

    return {
        headers: Object.assign(headers, { authorization: data.token }),
        token: data.token,
        refreshToken: data.refreshToken
    };
}
