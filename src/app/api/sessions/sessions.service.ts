import { Repo, CrudService } from '@shared/crud';
import { SessionSchema, SessionModel } from './sessions.model';
import { Document, Payload, WithMongoID } from '@lib/mongoose';
import { AppUtils, Omit } from '@core/utils';

export class SessionsService extends CrudService<SessionSchema> {

    constructor() {
        super(new Repo<SessionSchema>(SessionModel), {
            all: {
                pre(documentsQuery) {
                    documentsQuery.populate('user');
                }
            }
        });
    }

    public async deActivate(query: Partial<Omit<WithMongoID<Payload<SessionSchema>>, 'active'>>) {
        const record = await this.getActiveSession(query);
        if (record.hasError) {
            return {
                hasError: true,
                data: 'no session available'
            };
        }
        await this.setAsDeactive(record.data);
        // TODO: use Result class instead
        return { hasError: false, data: 'Session deactivated' };
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

    public getActiveUserSession(user: string) {
        return this.all({ user, active: true });
    }

    private setAsDeactive(record: Document<SessionSchema>) {
        return this.update(record, { active: false });
    }

    public async deActivatedUserSessions(user: string) {
        const result = await this.all({ user });
        return Promise.all(result.data.list.map((record) => this.setAsDeactive(record)));
    }

}

export const sessionsService = new SessionsService();
