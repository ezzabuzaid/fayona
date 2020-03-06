import { Constants } from '@core/helpers';
import { getUri, prepareUserSession } from '@test/fixture';
import { Types } from 'mongoose';
import { IDeactivateSessionPayload } from './sessions.model';
// import { SessionsService } from "./sessions.service";

// describe('Session Service', () => {

//    const service= new SessionsService(null);
//     service.deActivate(query);

// });

const ENDPOINT = Constants.Endpoints.SESSIONS;
const DEACTIVATE_ENDPOINT = getUri(`${ENDPOINT}/deactivate`);
const USER_SESSION_ENDPOINT = getUri(`${ENDPOINT}/${Constants.Endpoints.USERS_SESSIONS}`);

describe('#INTEGRATION', () => {

    describe('[getUserSessions]', () => {

        test('should not allow UNAUTHORIZED user', async () => {
            const response = await global.superAgent
                .get(USER_SESSION_ENDPOINT);
            expect(response.unauthorized).toBeTruthy();
        });

        test('should return user sessions', async () => {
            const lastSession = await prepareUserSession();
            const response = await global.superAgent
                .get(USER_SESSION_ENDPOINT)
                .set(lastSession.headers);
            expect(response.ok).toBeTruthy();
            expect(response.payload.data.length).toEqual(1);
        });

    });

    describe('[deActivateSession]', () => {
        test('should deactive a session by it is id', async () => {
            const userSession = await prepareUserSession();
            const response = await global.superAgent.patch(DEACTIVATE_ENDPOINT)
                .set(userSession.headers)
                .send({
                    user_id: userSession.user_id,
                    session_id: userSession.session_id
                } as IDeactivateSessionPayload);
            expect(response.ok).toBeTruthy();
            expect(response.payload.data).toBe('Session deactivated');
        });

        test('should return bad request if there is no session', async () => {
            const userSession = await prepareUserSession();
            const response = await global.superAgent.patch(DEACTIVATE_ENDPOINT)
                .set(userSession.headers)
                .send({
                    user_id: userSession.user_id,
                    session_id: new Types.ObjectId().toHexString(),
                } as IDeactivateSessionPayload);
            expect(response.badRequest).toBeTruthy();
            expect(response.payload.message).toBe('no session available');
        });

        test('should not accept non string session id', async () => {
            const userSession = await prepareUserSession();
            const response = await global.superAgent.patch(DEACTIVATE_ENDPOINT)
                .set(userSession.headers)
                .send({
                    user_id: userSession.user_id,
                    session_id: false as any,
                } as IDeactivateSessionPayload);
            expect(response.badRequest).toBeTruthy();
            expect(response.payload.message).toBe('session_id must be string');
        });

        test('should not accept non string user id', async () => {
            const userSession = await prepareUserSession();
            const response = await global.superAgent.patch(DEACTIVATE_ENDPOINT)
                .set(userSession.headers)
                .send({
                    user_id: false as any,
                    session_id: userSession.session_id,
                } as IDeactivateSessionPayload);
            expect(response.badRequest).toBeTruthy();
            expect(response.payload.message).toBe('user_id must be string');
        });
    });

});
