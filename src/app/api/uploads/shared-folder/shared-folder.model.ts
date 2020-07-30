import { Constants } from '@core/constants';
import { Entity, Field, ForeignKey } from '@lib/mongoose';

@Entity(Constants.Schemas.SharedFolders)
export class SharedFolderSchema {
    @Field() user: ForeignKey = null;
    @Field({
        ref: Constants.Schemas.FOLDERS
    }) folder: ForeignKey = null;
    @Field() shared = false;
}
