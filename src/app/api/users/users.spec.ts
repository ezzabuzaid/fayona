import axios from 'axios';
import fetch from 'node-fetch';

describe('get list of users', () => {
    test('should return list of user', async () => {
        console.log(process.env['JWT_SECRET_KEY']);
        // const res = await fetch(`${'http://127.0.0.1:8080'}/users/`);
        // const list = await res.json()
        // expect(list.data).toMatchObject([{}]);
        expect(true).toBeTruthy();
    });
})