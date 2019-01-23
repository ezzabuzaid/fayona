import { Local } from './local';
import { LocalizationService } from './localization.service';
import { development } from '@core/helpers';

import { Logger } from '@core/utils';
const log = new Logger('Localization Class');

class Localization extends LocalizationService {
    /**
     * list of observed locals
     */
    private locals: Local[] = [];

    constructor() {
        super()
    }

    /**
     * 
     * @param name name of the local
     * @param local the local to add
     */
    add(name: string, local: object): Local {
        // if there's already throw an error in dev mode

        development(
            () => {
                if (this.get(name)) {
                    throw new Error(`Local ${name} is already exist`);
                }
            }
        )

        // create a new local
        const newLocal = new Local(name, local);

        // register the local
        this.locals.push(newLocal);

        // emit a value to localAdded event
        this.localAdded.emit(local);

        log.info(`local with name ${name} is added, consider using set(local) to use it`);


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
        if (!local) {
            throw new Error('local not found, please consider add it');
        }

        // set the local is active local
        this.local = local

        // emit a value to changeLocal event
        this.localChange.emit(local);

        log.info(`local with name ${name} is active`);

        return local;
    }
    /**
     * 
     * @param name get the local by it's name from the register locals
     */
    get(name: string) {

        // find the local
        const local = this.locals.find(loc => loc.name === name);

        return local || null;
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

const localization = new Localization();
// export the created instance, it must be a singelton 
export { localization };


// scoping not allowed until i18n service resolved in api module

/**
 * 
 * @param key the key that hold the value
 * @returns the value of the key from the active local
 */
export function translate(key: string) {
    return localization.local.get(key);
}

