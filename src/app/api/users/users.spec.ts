import { generatePhoneNumber, generateUsername, UserFixture } from '@test/fixture';
import { NetworkStatus } from '@core/helpers';
import { ERoles } from './users.model';
import * as faker from 'faker';

describe('[INTERGRATION]', () => {

    // NOTE test the fail then test the success
    describe('#CREATE USER', () => {

        let userFixture: UserFixture;

        beforeEach(() => {
            userFixture = new UserFixture();
        });

        describe('should fail if', () => {

            test('username exist before', async () => {
                const username = generateUsername();
                await userFixture.createUser({ username });
                const response = await userFixture.createUser({ username });
                expect(response.body.message).toMatch('username_entity_exist');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            test('email exist before', async () => {
                const email = faker.internet.email();
                await userFixture.createUser({ email });
                const response = await userFixture.createUser({ email });
                expect(response.body.message).toMatch('email_entity_exist');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            test('mobile exist before', async () => {
                const mobile = generatePhoneNumber();
                await userFixture.createUser({ mobile });
                const response = await userFixture.createUser({ mobile });
                expect(response.body.message).toMatch('mobile_entity_exist');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            test('username contains special char', async () => {
                const response = await userFixture.createUser({ username: 'testCreate2#$' });
                expect(response.body.message).toContain('wrong_username');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });

            test('mobile number is wrong', async () => {
                const response = await userFixture.createUser({ mobile: '0792807794' });
                expect(response.body.message).toContain('wrong_mobile');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('role is not one of supported roles', async () => {
                const response = await userFixture.createUser({ role: 10 });
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('email has no suffix', async () => {
                const response = await userFixture.createUser({ email: 'test@test' });
                expect(response.body.message).toContain('wrong_email');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
            test('email has no @', async () => {
                const response = await userFixture.createUser({ email: 'testtest.com' });
                expect(response.body.message).toContain('wrong_email');
                expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            });
        });

        describe('should pass if', () => {
            test('should pass if mobile number is correct', async () => {
                const response = await userFixture.createUser({ mobile: '+962792807794' });
                expect(response.status).toBe(NetworkStatus.CREATED);
            });
            test('should pass if the role is one of supported roles', async () => {
                const response = await userFixture.createUser({ role: ERoles.ADMIN });
                expect(response.status).toBe(NetworkStatus.CREATED);
            });
            test('should pass if the email has correct format', async () => {
                const response = await userFixture.createUser({ email: 'ezzabuzaid@hotmail.com' });
                expect(response.status).toBe(NetworkStatus.CREATED);
            });
            test('username has no special char', async () => {
                const response = await userFixture.createUser({ username: 'testname' });
                expect(response.status).toBe(NetworkStatus.CREATED);
            });
            test('username has uppercase char', async () => {
                const response = await userFixture.createUser({ username: 'upperCASETestName' });
                expect(response.status).toBe(NetworkStatus.CREATED);
            });
            test('username has dots', async () => {
                const response = await userFixture.createUser({ username: 'test.name' });
                expect(response.status).toBe(NetworkStatus.CREATED);
            });
            test('username has underscore', async () => {
                const response = await userFixture.createUser({ username: 'test_name' });
                expect(response.status).toBe(NetworkStatus.CREATED);
            });
        });

        // xit.todo('should have verified to false by default', async () => {
        //     const sendRequestResponse = await sendRequest(ENDPOINT, user());
        //     const getRequestResponse = await getRequest(`${ENDPOINT}/${sendRequestResponse.body.data.id}`);
        //     console.log((getRequestResponse.body));
        //     expect(getRequestResponse.body.data.verified).toEqual(false);
        // });

        test.todo('user should have a defualt profile equal to empty {}');
        // test('Profile Should have an empty object when creating a new user', async () => {
        //     const req = superAgent.post(ENDPOINT);
        //     const res = await req.send(user);
        //     expect(((res.body) as Body<UsersSchema>)./api/users/undefinedprofile).toBe(undefined);
        //     // TODO: the profile object should has a default value in the service
        //              and not in model, then uncomment the below code
        //     // expect(((res.body) as Body<UsersSchema>).profile).toMatchObject({});
        //     expect(res.status).toBe(NetworkStatus.CREATED);
        // });

    });

});
