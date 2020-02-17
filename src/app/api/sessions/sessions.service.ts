import { Repo, CrudService } from '@shared/crud';
import { SessionSchema, SessionModel } from './sessions.model';
import { Document, Body, WithMongoID } from '@lib/mongoose';
import { AppUtils } from '@core/utils';

export class SessionsService extends CrudService<SessionSchema> {

    public async deActivate(query: Partial<WithMongoID<Body<SessionSchema>>>) {
        const record = await this.getActiveSession(query);
        if (AppUtils.isTruthy(record)) {
            await this.setAsDeactive(record);
            return { hasError: false, data: 'Session deactivated' };
        }
        return { hasError: true, data: 'no session available' };
    }

    public getActiveSession(query: Partial<WithMongoID<Body<SessionSchema>>>) {
        return this.one({
            ...query,
            active: true
        });
    }

    private setAsDeactive(record: Document<SessionSchema>) {
        return record.set({ active: false }).save();
    }

    public async deActivatedUserSessions(user_id: string) {
        const records = await this.all({ user_id });
        return Promise.all(records.map((record) => this.setAsDeactive(record)));
    }

}

export const sessionsService = new SessionsService(new Repo<SessionSchema>(SessionModel));
