import { Constants, tokenService } from '@core/helpers';
import { UsersSchema, ERoles } from '@api/users';
import { Payload, WithMongoID } from '@lib/mongoose';
import * as faker from 'faker';
import { ValidationPatterns } from '@shared/common';
import { ApplicationConstants } from '@core/constants';
import { AppUtils } from '@core/utils';
import { LoginPayload } from '@api/portal';

export function generateDeviceUUIDHeader() {
    return {
        [ApplicationConstants.deviceIdHeader]: faker.random.uuid()
    };
}

export function getUri(value: string) {
    return `/api/${value}`;
}

export async function prepareUserSession(user?: WithMongoID<LoginPayload>) {
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
        .post(getUri(`${Constants.Endpoints.PORTAL}/${Constants.Endpoints.LOGIN}`))
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
    private usersEndpoint = getUri(Constants.Endpoints.USERS);

    public async createUser(paylod: Partial<Payload<UsersSchema>> = {}) {
        const response = await global.superAgent.post(this.usersEndpoint)
            .set(generateDeviceUUIDHeader())
            .send({
                email: faker.internet.email(),
                username: generateUsername(),
                mobile: generatePhoneNumber(),
                password: faker.internet.password(),
                verified: false,
                role: ERoles.ADMIN,
                profile: null,
                ...paylod
            });
        try {
            this.user.id = response.body.data.id;
        } catch (error) { }
        return response;
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
    return tokenService.generateToken({ id: AppUtils.generateRandomString() }, { expiresIn: '-10s' });
}

export function generateToken() {
    return tokenService.generateToken({ id: AppUtils.generateAlphabeticString() });
}
