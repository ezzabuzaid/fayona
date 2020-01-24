import '@test/index';
import { getUri, sendRequest, deleteRequest, generatePhoneNumber, generateUsername, getRequest } from '@test/fixture';
import { Constants, NetworkStatus } from '@core/helpers';
import { Body } from '@lib/mongoose';
import { UsersSchema, ERoles } from './users.model';
import { AppUtils } from '@core/utils';
import * as faker from 'faker';
import usersService from './users.service';

const ENDPOINT = getUri(Constants.Endpoints.USERS);
const user = (body: Partial<Body<UsersSchema>> = {}) => ({
    email: faker.internet.email(),
    username: generateUsername(),
    mobile: generatePhoneNumber(),
    password: faker.internet.password(),
    verified: false,
    role: ERoles.ADMIN,
    profile: null,
    ...body
} as Body<UsersSchema>);

describe('[INTERGRATION]', () => {

    // NOTE test the fail then test the success
    fdescribe('#CREATE USER', () => {
        fdescribe('should fail if', () => {
            it('username exist before', async () => {
                const username = generateUsername();
                await sendRequest<Body<UsersSchema>>(ENDPOINT, user({ username }));
                const response = await sendRequest<Body<UsersSchema>>(ENDPOINT, user({ username }));
                expect(response.body.message).toMatch('username_entity_exist');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            it('email exist before', async () => {
                const email = faker.internet.email();
                await sendRequest<Body<UsersSchema>>(ENDPOINT, user({ email }));
                const response = await sendRequest<Body<UsersSchema>>(ENDPOINT, user({ email }));
                expect(response.body.message).toMatch('email_entity_exist');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            it('mobile exist before', async () => {
                const mobile = generatePhoneNumber();
                await sendRequest<Body<UsersSchema>>(ENDPOINT, user({ mobile }));
                const response = await sendRequest<Body<UsersSchema>>(ENDPOINT, user({ mobile }));
                expect(response.body.message).toMatch('mobile_entity_exist');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('username contains special char', async () => {
                const res = await sendRequest(ENDPOINT, user({ username: 'testCreate2#$' }));
                expect(res.body.message).toContain('wrong_username');
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('mobile number is wrong', async () => {
                const res = await sendRequest(ENDPOINT, user({ mobile: '0792807794' }));
                expect(res.body.message).toContain('wrong_mobile');
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('role is not one of supported roles', async () => {
                const res = await sendRequest(ENDPOINT, user({ role: 10 }));
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('email has no suffix', async () => {
                const res = await sendRequest(ENDPOINT, user({ email: 'test@test' }));
                expect(res.body.message).toContain('wrong_email');
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('email has no @', async () => {
                const res = await sendRequest(ENDPOINT, user({ email: 'testtest.com' }));
                expect(res.body.message).toContain('wrong_email');
                expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
            });
        });

        describe('should pass if', () => {
            test('should pass if mobile number is correct', async () => {
                const res = await sendRequest(ENDPOINT, user({ mobile: '+962792807794' }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
            test('should pass if the role is one of supported roles', async () => {
                const res = await sendRequest(ENDPOINT, user({ role: ERoles.ADMIN }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
            test('should pass if the email has correct format', async () => {
                const res = await sendRequest(ENDPOINT, user({ email: 'ezzabuzaid@hotmail.com' }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
            test('username has no special char', async () => {
                const res = await sendRequest(ENDPOINT, user({ username: 'testname' }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
            test('username has uppercase char', async () => {
                const res = await sendRequest(ENDPOINT, user({ username: 'testName' }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
            test('username has dots', async () => {
                const res = await sendRequest(ENDPOINT, user({ username: 'test.name' }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
            test('username has underscore', async () => {
                const res = await sendRequest(ENDPOINT, user({ username: 'test_name' }));
                expect(res.status).toBe(NetworkStatus.CREATED);
            });
        });

        xit.todo('should have verified to false by default', async () => {
            const sendRequestResponse = await sendRequest(ENDPOINT, user());
            const getRequestResponse = await getRequest(`${ENDPOINT}/${sendRequestResponse.body.data.id}`);
            console.log((getRequestResponse.body));
            expect(getRequestResponse.body.data.verified).toEqual(false);
        });

        test.todo('user should have a defualt profile equal to empty {}');
        // test('Profile Should have an empty object when creating a new user', async () => {
        //     const req = (await superAgent).post(ENDPOINT);
        //     const res = await req.send(user);
        //     expect(((res.body) as Body<UsersSchema>)./api/users/undefinedprofile).toBe(undefined);
        //     // TODO: the profile object should has a default value in the service
        //              and not in model, then uncomment the below code
        //     // expect(((res.body) as Body<UsersSchema>).profile).toMatchObject({});
        //     expect(res.status).toBe(NetworkStatus.CREATED);
        // });

    });

    describe('#GET USER', () => {
        test.todo(`user body should contain only id`);
    });

});
