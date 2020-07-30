import { Constants } from '@core/constants';
import { Entity, Field } from '@lib/mongoose';

@Entity(Constants.Schemas.FOLDERS)
export class FoldersSchema {
    @Field({ lowercase: false }) public name: string;
}
