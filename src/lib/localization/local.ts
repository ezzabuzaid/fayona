export class Local {
    /**
     * the local object
     */
    private _language;

    /**
     * name of the local
     */
    private _name: string;

    /**
     * 
     * @param name name of the local
     * @param language local object
     */
    constructor(name, language: object) {
        this._name = name;
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
    set(key: string, value: any) {
        // throw an error in dev mode to tell him that you create a new one not override an exisiting one
        this.language[key] = value;
    }

    /**
     * 
     * @param key get the value by it's key for this local
     */

    get(key: string) {
        const value = this.language[key];

        if (!value) throw new Error(`the key { ${key} } is not found in local { ${this._name} }`)

        return value;
    }
}