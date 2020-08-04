import { CrudService, CrudDao } from '@shared/crud';
import { SettingSchema } from './settings.model';

export class SettingService extends CrudService<SettingSchema> {
    constructor() {
        super(new CrudDao(SettingSchema));
    }
}
