import { Reactor } from '@core/config';

import { Logger } from '@core/utils';
const log = new Logger('LocalizationService Class');

export class LocalizationService {
    private eventName = 'localization';
    private _localAdd = new Reactor(`${this.eventName}_add`);
    private _localChange = new Reactor(`${this.eventName}_change`);
    constructor() {
        // super((() => this.eventName)());
    }

    get localAdded() {
        return this._localAdd;
    }

    get localChange() {
        return this._localChange;
    }

}
