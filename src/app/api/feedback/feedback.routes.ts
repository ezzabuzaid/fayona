import { Router } from '@lib/methods';
import { CrudService } from '@shared/crud';
import { FeedbackSchema, FeedbackModel } from './feedback.model';
import { Repo } from '@shared/crud/crud.repo';
import { Constants } from '@core/helpers';
import { CrudRouter } from '@shared/crud/crud.router';

@Router(Constants.Endpoints.Feedback)
export class FeedbackRouter extends CrudRouter<FeedbackSchema> {
    constructor() {
        super(new CrudService(new Repo(FeedbackModel)));
    }
}
