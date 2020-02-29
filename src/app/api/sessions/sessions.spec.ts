import { Constants, NetworkStatus } from '@core/helpers';
import { getUri, getRequest, prepareUserSession } from '@test/fixture';
import path from 'path';
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
            expect(response.status).toBe(NetworkStatus.UNAUTHORIZED);
        });

        test('should return user sessions', async () => {
            const lastSession = await prepareUserSession();
            const response = await global.superAgent
                .get(USER_SESSION_ENDPOINT)
                .set(lastSession.headers);
            expect(response.status).toBe(NetworkStatus.OK);
            expect(response.body.data.length).toEqual(1);
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
            expect(response.status).toBe(NetworkStatus.OK);
            expect(response.body.data).toBe('Session deactivated');
        });

        test('should return bad request if there is no session', async () => {
            const userSession = await prepareUserSession();
            const response = await global.superAgent.patch(DEACTIVATE_ENDPOINT)
                .set(userSession.headers)
                .send({
                    user_id: userSession.user_id,
                    session_id: new Types.ObjectId().toHexString(),
                } as IDeactivateSessionPayload);
            expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            expect(response.body.message).toBe('no session available');
        });

        test('should not accept non string session id', async () => {
            const userSession = await prepareUserSession();
            const response = await global.superAgent.patch(DEACTIVATE_ENDPOINT)
                .set(userSession.headers)
                .send({
                    user_id: userSession.user_id,
                    session_id: false as any,
                } as IDeactivateSessionPayload);
            expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            expect(response.body.message).toBe('session_id must be string');
        });

        test('should not accept non string user id', async () => {
            const userSession = await prepareUserSession();
            const response = await global.superAgent.patch(DEACTIVATE_ENDPOINT)
                .set(userSession.headers)
                .send({
                    user_id: false as any,
                    session_id: userSession.session_id,
                } as IDeactivateSessionPayload);
            expect(response.status).toBe(NetworkStatus.BAD_REQUEST);
            expect(response.body.message).toBe('user_id must be string');
        });
    });

});
