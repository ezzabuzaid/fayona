import assert from 'assert';
import { notNullOrUndefined } from '../utils';

export class Local<T> {
    /**
     * the local object
     */
    private _language;

    /**
     * name of the local
     */
    public name: T;

    /**
     *
     * @param name name of the local
     * @param language local object
     */
    constructor(name: T, language: object) {
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
        assert(notNullOrUndefined(this.language[key]), `a key with name ${ key } is already hold a value`);
        this.language[key] = value;
    }

    /**
     *
     * @param key get the value by it's key for this local
     */

    public get(key: string): string {
        const value = this.language[key];
        assert(value, `the key { ${ key } } is not found in local { ${ this.name } }`);
        return value;
    }
}
