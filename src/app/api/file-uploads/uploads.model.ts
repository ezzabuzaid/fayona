import { Entity, Field, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.UPLOADS)
export class UploadsSchema {
    @Field() public type: string;
    @Field() public size: number;
    @Field() public name: string;
    @Field() public url: string;
}

export const UploadsModel = BaseModel(UploadsSchema);
