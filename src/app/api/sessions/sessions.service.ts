import { Repo, CrudService } from '@shared/crud';
import { SessionSchema, SessionModel } from './sessions.model';
import { Document, Body, WithID } from '@lib/mongoose';

export class SessionsService extends CrudService<SessionSchema> {

    public async deActivate(query: Partial<WithID<Body<SessionSchema>>>) {
        const record = await this.getActiveSession(query);
        this.setAsDeactive(record);
    }

    public getActiveSession(query: Partial<WithID<Body<SessionSchema>>>) {
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
