import { Entity, Field, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';
import { Types } from 'mongoose';

@Entity(Constants.Schemas.FOLDERS)
export class FoldersSchema {
    @Field({ required: true }) public user: Types.ObjectId;
    @Field({ lowercase: false }) public name: string;
}

export const FoldersModel = BaseModel(FoldersSchema);
