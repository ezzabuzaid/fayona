import { Router } from '@lib/methods';
import { CrudRouter, CrudService } from '@shared/crud';
import { FeedbackSchema, FeedbackModel } from './feedback.model';
import { Repo } from '@shared/crud/crud.repo';
import { Constants } from '@core/helpers';

@Router(Constants.Endpoints.Feedback)
export class FeedbackRouter extends CrudRouter<FeedbackSchema> {
    constructor() {
        super(new CrudService(new Repo(FeedbackModel)));
    }
}
