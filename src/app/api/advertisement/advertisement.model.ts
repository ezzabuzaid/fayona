import { Field, BaseModel, Entity } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { AppUtils } from '@core/utils';

export enum EAdvertisementType {
    normal,
    special
}

@Entity(Constants.Schemas.advertisement)
export class AdvertisementModel {
    @Field() title: string;
    @Field() description: string;
    @Field({ enum: AppUtils.enumValues(EAdvertisementType) }) type: string;
    @Field() dueDate?: Date;
}

export default BaseModel(AdvertisementModel);
