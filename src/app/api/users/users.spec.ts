import { sign } from 'jsonwebtoken';
declare const JestRequest: any;
let id = null;
let token = null;
beforeAll(async () => {
    const req = JestRequest.post(`/api/users/`);
    req.send({
        email: 'test@test.com',
        password: '123456789',
        username: 'test',
    });
    const res = await req;
    console.log(res);
    id = res.body.data._id;
    token = sign({ id }, process.env.JWT_SECRET_KEY);
});

afterAll(async () => {
    const req = JestRequest.delete(`/api/users/${id}`);
    await req.set('Authorization', token);
});

// NOTE test the fail, don't test the success
describe('/api/users/', () => {
    test('Reject request without token', async () => {
        const res = await JestRequest.get('/api/users');
        expect(res.status).toBe(401);
    });

    // test('GET:// all users', async () => {
    //     const req =JestRequest.get('/api/users');
    //     const res = await req.set('Authorization', token);
    //     expect(res.status).toBe(200);
    //     expect(res.body.data).toBeInstanceOf(Array);
    // });
});

// describe('/api/users/${id}/', () => {
//     test('Reject request without token', async () => {
//         const res = awaitJestRequest.get(`/api/users/${id}`);
//         expect(res.status).toBe(401);
//     });

//     test('should fail if requested with id not of type ObjectId', async () => {
//         // this will rise cast error
//         const req =JestRequest.get(`/api/users/${undefined}`);
//         const res = await req.set('Authorization', token);
//         expect(res.status).toBe(400);
//     });

//     test('should fail if requested to non exist entity', async () => {
//         const req =JestRequest.get(`/api/users/${new Types.ObjectId}`);
//         const res = await req.set('Authorization', token);
//         expect(res.status).toBe(406);
//     });

//     test('resposne propery should equal to', async () => {
//         const req =JestRequest.get(`/api/users/${id}`);
//         const res = await req.set('Authorization', token);
//         const { data } = res.body;
//         expect(data).toHaveProperty('username')
//         expect(data).toHaveProperty('email')
//         expect(data).toHaveProperty('createdAt');
//         expect(data).toHaveProperty('updatedAt');
//         expect(data).toHaveProperty('_id');
//         expect(data).not.toHaveProperty('password');
//     });
// });

// REVIEW  in create and update you should check and verify if the data was update or created successfully other that the failur test
// and in delete you must check that the entity no longer in database
// in update and create you must test the validation by insert Wrong data
// in login check login test cases
