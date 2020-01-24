import { Repo } from '@shared/crud/crud.repo';
import { CrudService } from '@shared/crud/crud.service';
import { SessionSchema, SessionModel } from './sessions.model';
import { Document, Body, WithID } from '@lib/mongoose';

export class SessionService extends CrudService<SessionSchema> {

    public async deActivate(query: Partial<WithID<Body<SessionSchema>>>) {
        const record = await this.getActiveSession(query);
        return this.setAsDeactive(record);
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

export const sessionsService = new SessionService(new Repo<SessionSchema>(SessionModel));
