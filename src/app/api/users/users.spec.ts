import { JestRequest } from '../../../../jest.test';

describe('get list of users', () => {
    test('should return list of user', async () => {
        console.log(process.env);
        const res = JestRequest.get('/api/countries')
        console.log((await res).body);
        res.expect(200);
    });
})