import { Repo, CrudService, Query } from '@shared/crud';
import { SessionSchema, SessionModel } from './sessions.model';
import { Document, Payload, WithMongoID, ForeignKey } from '@lib/mongoose';
import { Omit } from '@core/utils';
import { Result } from '@core/helpers';

export class SessionsService extends CrudService<SessionSchema> {

    constructor() {
        super(new Repo<SessionSchema>(SessionModel));
    }

    all(query: Query<SessionSchema>, options = {}) {
        return super.all(query, {
            ...options,
            populate: 'user'
        });
    }

    public async deActivate(query: Partial<WithMongoID<Payload<Omit<SessionSchema, 'active'>>>>) {
        const record = await this.getActiveSession(query);
        if (record.hasError) {
            return new Result({ message: 'No session available' });
        }
        await this.setAsDeactive(record.data);
        return new Result({ message: 'Session deactivated' });

    }

    public getActiveSession(query: Partial<Payload<SessionSchema>>) {
        return this.one({
            ...query,
            active: true
        });
    }

    public getAllActiveSession() {
        return this.all({ active: true });
    }

    public getActiveUserSession(user: ForeignKey) {
        return this.all({ user, active: true });
    }

    private setAsDeactive(record: Document<SessionSchema>) {
        return this.update(record, { active: false });
    }

    public async deActivatedUserSessions(user: ForeignKey) {
        const result = await this.all({ user });
        return Promise.all(result.data.list.map((record) => this.setAsDeactive(record)));
    }

}

export const sessionsService = new SessionsService();
