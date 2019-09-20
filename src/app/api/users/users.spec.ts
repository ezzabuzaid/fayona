import { Types } from 'mongoose';
import { superAgent } from '@test/supertest';
import '@test/index';
import { createUser, deleteUser, UserFixture } from '@test/fixture';
import { Constants, NetworkStatus } from '@core/helpers';

const ENDPOINT = `/api/${Constants.Endpoints.USERS}`;
let user: UserFixture = null;
beforeAll(async () => {
    user = await createUser();
});

afterAll(async () => {
    deleteUser();
});

// NOTE test the fail, don't test the success
describe('GET ALL', () => {
    test('Reject request without token', async () => {
        (await superAgent).get(ENDPOINT);
        const res = (await (await superAgent).get(`${ENDPOINT}`));
        expect(res.status).toBe(NetworkStatus.UNAUTHORIZED);
    });

    test('Should return list', async () => {
        const req = (await superAgent).get(`${ENDPOINT}`);
        const res = await req.set('Authorization', user.token);
        expect(res.status).toBe(NetworkStatus.OK);
        expect(res.body.data).toBeInstanceOf(Array);
    });
});

describe('GET BY ${id}/', () => {
    test('Reject request without token', async () => {
        const res = await (await superAgent).get(`${ENDPOINT}/${user.id}`);
        expect(res.status).toBe(NetworkStatus.UNAUTHORIZED);
    });

    test('should fail if requested with id not of type ObjectId', async () => {
        // this will rise cast error
        const req = (await superAgent).get(`${ENDPOINT}/${undefined}`);
        const res = await req.set('Authorization', user.token);
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });

    test('should fail if requested to non exist entity', async () => {
        const req = (await superAgent).get(`${ENDPOINT}/${new Types.ObjectId()}`);
        const res = await req.set('Authorization', user.token);
        expect(res.status).toBe(NetworkStatus.NOT_ACCEPTABLE);
    });

    test('resposne body should equal to', async () => {
        const req = (await superAgent).get(`${ENDPOINT}/${user.id}`);
        const res = await req.set('Authorization', user.token);
        const { data } = res.body;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('email');
        expect(data).toHaveProperty('mobile');
        expect(data).toHaveProperty('createdAt');
        expect(data).toHaveProperty('updatedAt');
        expect(data).toHaveProperty('_id');
        // password return, even it returned without being hashing
        expect(data).not.toHaveProperty('password');
    });
});

describe('DELETE BY ${id}/', () => {
    test('Reject request without token', async () => {
        const res = await (await superAgent).delete(`${ENDPOINT}/${user.id}`);
        expect(res.status).toBe(NetworkStatus.UNAUTHORIZED);
    });

    test('should fail if requested with id not of type ObjectId', async () => {
        const req = (await superAgent).delete(`${ENDPOINT}/${undefined}`);
        const res = await req.set('Authorization', user.token);
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });

    test('should fail if requested to non exist entity', async () => {
        const req = (await superAgent).delete(`${ENDPOINT}/${new Types.ObjectId()}`);
        const res = await req.set('Authorization', user.token);
        expect(res.status).toBe(NetworkStatus.NOT_ACCEPTABLE);
    });

    test('resposne body should equal to', async () => {
        const req = (await superAgent).delete(`${ENDPOINT}/${user.id}`);
        const res = await req.set('Authorization', user.token);
        const { data } = res.body;
        expect(data).toBeNull();
    });
});

// tslint:disable-next-line: max-line-length
// REVIEW  in create and update you should check and verify if the data was update or created successfully other that the failur test
// and in delete you must check that the entity no longer in database
// in update and create you must test the validation by insert Wrong data
// in login check login test cases
// try to send wrong mobile, email
