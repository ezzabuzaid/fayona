import { Constants } from '@core/constants';
import { Entity, Field } from '@lib/mongoose';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.UPLOADS)
export class UploadsSchema {
    @Field({ required: false }) tag?: string = '';
    @Field() public type: string;
    @Field() public size: number;
    @Field() public name: string;
    @Field() public path: string;
    @Field({ required: true }) public user: Types.ObjectId;
    @Field({ required: true, ref: Constants.Schemas.FOLDERS }) public folder: Types.ObjectId;
}
