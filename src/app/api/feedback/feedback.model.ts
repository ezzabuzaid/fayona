import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { ValidationPatterns } from '@shared/common';

@Entity(Constants.Schemas.Feedback)
export class FeedbackSchema {
    @Field({ enum: { values: [], message: '' } }) public rate: string;
    @Field() public description: string;
    @Field() public type: string;
}

export const FeedbackModel = BaseModel<FeedbackSchema>(FeedbackSchema);
