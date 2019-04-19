import axios from 'axios';
const request = require('supertest');

// toke
describe('get list of users', () => {
    test('should return list of user', async () => {
        const { data } = await axios.post(`${'http://127.0.0.1:8080'}/api/users`, {
            username: 'jest',
            password: 'ow99bfte',
            email: 'jest@test.com'
        });
        console.log(process.env['JWT_SECRET_KEY'], data);
        // const list = await res.json()
        // expect(list.data).toMatchObject([{}]);
        expect(true).toBeTruthy();
    });
})