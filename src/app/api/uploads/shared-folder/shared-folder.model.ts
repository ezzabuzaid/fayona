import { Field, Entity, BaseModel, ForeignKey } from '@lib/mongoose';
import { Repo } from '@shared/crud';
import { Constants } from '@core/helpers';

@Entity('SharedFolders')
export class SharedFolderSchema {
    @Field() user: ForeignKey = null;
    @Field({
        ref: Constants.Schemas.FOLDERS
    }) folder: ForeignKey = null;
    @Field() shared = false;
}

export default new Repo(BaseModel(SharedFolderSchema));
