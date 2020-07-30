import { Constants } from '@core/constants';
import { AppUtils } from '@core/utils';
import { Entity, Field } from '@lib/mongoose';

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
