import { development } from '@core/helpers';

import { Logger } from '@core/utils';
const log = new Logger('Local Class');

export class Local {
    /**
     * the local object
     */
    private _language;

    /**
     * name of the local
     */
    public name: string;

    /**
     *
     * @param name name of the local
     * @param language local object
     */
    constructor(name, language: object) {
        this.name = name;
        this._language = language;
    }

    /**
     * get the local object
     */
    private get language() {
        return this._language;
    }

    /**
     *
     * @param key
     * @param value
     */
    public set(key: string, value: any) {
        development(
            () => {
                log.warn(`a key with name ${key} is already hold a value`);
            }
        );
        this.language[key] = value;
    }

    /**
     *
     * @param key get the value by it's key for this local
     */

    public get(key: string): string {
        const value = this.language[key];
        if (!value) {
            throw new Error(`the key { ${key} } is not found in local { ${this.name} }`);
        }

        return value;
    }
}
