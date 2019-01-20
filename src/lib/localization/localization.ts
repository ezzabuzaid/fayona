import { Local } from './local';


class Localization {
    /**
     * list of observed locals
     */
    private locals = [];

    constructor() { }

    /**
     * 
     * @param name name of the local
     * @param local the local to add
     */
    add(name: string, local: object): Local {
        // Must check if local is exist
        // if throw an error
        const newLocal = new Local(name, local);
        this.locals.push(newLocal);
        return newLocal;
    }

    /**
     * 
     * @param name name of the local you wanna use
     * @returns local
     */
    use(name: string): Local {

        // get the local from the list
        const local = this.get(name);

        // check if the local is exist
        if (!local) throw new Error('local not found, please consider add it');

        // set the local is active local
        this.local = local

        return local;
    }
    /**
     * 
     * @param name get the local by it's name from the register locals
     */
    get(name: string) {

        // find the local
        const local = this.locals.find(loc => loc.name === name);

        return local;
    }

    /**
     * the active local
     */
    private _local: Local;

    /**
     * get the active local
     */
    get local() {
        return this._local;
    }

    /**
     * set local as active one
     */
    set local(local) {
        this._local = local;
    }

}

// create a new instance from Localization class
const localization = new Localization();

// export the created instance, it must be a singelton 
export default localization;

/**
 * 
 * @param key the key that hold the value
 * @returns the value of the key from the active local
 */
export function translate(key: string) {
    return localization.local.get(key);
}

// on local change reaction

// scoping not allowed until i18n service resolved in api module

// like a set in local class it's mean override an existing key, maybe he will set a new key by mistake, so an error need here to tell him what exactle he doing
// but this error mustly ignored in production mode
// so an init method needed to tell the translate, the state of our server 