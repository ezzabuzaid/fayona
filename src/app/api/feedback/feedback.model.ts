import { BaseModel, Entity, Field } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.Feedback)
export class FeedbackSchema {
    @Field({ enum: { values: [], message: '' } }) public rate: string;
    @Field() public description: string;
    @Field() public type: string;
}

