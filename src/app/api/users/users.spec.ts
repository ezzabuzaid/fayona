import { sign } from 'jsonwebtoken';
import { Types } from 'mongoose';
import supertest = require('supertest');
import { JestRequest } from '../../../../test';

let id = null;
let token = null;
let client: supertest.SuperTest<supertest.Test> = null;
const ENDPOINT = '/api/users';
beforeAll(async () => {
    client = await JestRequest();
    const req = client.post(`${ENDPOINT}/`);
    req.send({
        email: 'test@test.com',
        password: '123456789',
        username: 'test',
        mobile: '+962792807794'
    });
    const res = await req;
    id = res.body.data._id;
    token = sign({ id }, process.env.JWT_SECRET_KEY);
});

afterAll(async () => {
    const req = client.delete(`${ENDPOINT}/${id}`);
    await req.set('Authorization', token);
});

// NOTE test the fail, don't test the success
describe('GET ALL', () => {
    test('Reject request without token', async () => {
        const res = await client.get(`${ENDPOINT}`);
        expect(res.status).toBe(401);
    });

    test('Should return list', async () => {
        const req = client.get(`${ENDPOINT}`);
        const res = await req.set('Authorization', token);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
    });
});

describe('GET BY ${id}/', () => {
    test('Reject request without token', async () => {
        const res = await client.get(`${ENDPOINT}/${id}`);
        expect(res.status).toBe(401);
    });

    test('should fail if requested with id not of type ObjectId', async () => {
        // this will rise cast error
        const req = client.get(`${ENDPOINT}/${undefined}`);
        const res = await req.set('Authorization', token);
        expect(res.status).toBe(400);
    });

    test('should fail if requested to non exist entity', async () => {
        const req = client.get(`${ENDPOINT}/${new Types.ObjectId()}`);
        const res = await req.set('Authorization', token);
        expect(res.status).toBe(406);
    });

    test('resposne body should equal to', async () => {
        const req = client.get(`${ENDPOINT}/${id}`);
        const res = await req.set('Authorization', token);
        const { data } = res.body;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('email');
        expect(data).toHaveProperty('mobile');
        expect(data).toHaveProperty('createdAt');
        expect(data).toHaveProperty('updatedAt');
        expect(data).toHaveProperty('_id');
        expect(data).not.toHaveProperty('password');
    });

    
});


describe('DELETE BY ${id}/', () => {
    test('Reject request without token', async () => {
        const res = await client.delete(`${ENDPOINT}/${id}`);
        expect(res.status).toBe(401);
    });

    test('should fail if requested with id not of type ObjectId', async () => {
        // this will rise cast error
        const req = client.delete(`${ENDPOINT}/${undefined}`);
        const res = await req.set('Authorization', token);
        expect(res.status).toBe(400);
    });

    test('should fail if requested to non exist entity', async () => {
        const req = client.delete(`${ENDPOINT}/${new Types.ObjectId()}`);
        const res = await req.set('Authorization', token);
        expect(res.status).toBe(406);
    });

    test('resposne body should equal to', async () => {
        const req = client.delete(`${ENDPOINT}/${id}`);
        const res = await req.set('Authorization', token);
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
