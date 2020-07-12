import { CrudService, Repo } from '@shared/crud';
import { SettingSchema } from './settings.model';

export class SettingService extends CrudService<SettingSchema> {
    constructor() {
        super(new Repo(SettingSchema));
    }
}
