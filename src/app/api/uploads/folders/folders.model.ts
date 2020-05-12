import { Entity, Field, BaseModel } from '@lib/mongoose';
import { Constants } from '@core/helpers';

@Entity(Constants.Schemas.FOLDERS)
export class FoldersSchema {
    @Field({ lowercase: false }) public name: string;
}

export default BaseModel(FoldersSchema);
