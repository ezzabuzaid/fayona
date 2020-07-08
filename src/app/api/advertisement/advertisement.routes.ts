import { Router } from '@lib/restful';
import { CrudRouter, CrudService, Repo } from '@shared/crud';
import { AdvertisementModel } from './advertisement.model';
import { Constants } from '@core/helpers';

@Router(Constants.Endpoints.advertisement)
export class AdvertisementRouter extends CrudRouter<AdvertisementModel> {
    constructor() {
        super(new CrudService(new Repo(AdvertisementModel)));
    }
}