import { Router } from '@lib/restful';
import feedbackModel, { FeedbackSchema, } from './feedback.model';
import { Repo, CrudRouter, CrudService } from '@shared/crud';
import { Constants } from '@core/helpers';

@Router(Constants.Endpoints.FEEDBACK)
export class FeedbackRouter extends CrudRouter<FeedbackSchema> {
    constructor() {
        super(new CrudService(new Repo(feedbackModel)));
    }
}
