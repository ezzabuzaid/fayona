import { CrudService, Repo } from '@shared/crud';
import settingsModel, { SettingSchema } from './settings.model';

export class SettingService extends CrudService<SettingSchema> {
    constructor() {
        super(new Repo(settingsModel));
    }
}
