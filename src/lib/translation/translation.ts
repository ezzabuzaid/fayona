import { stage, StageLevel } from '@core/helpers';
import { Local } from './local';
import { TranslationService } from './translation.service';

import { Logger } from '@core/utils';
const log = new Logger('Localization Class');

class Translation extends TranslationService {
    /**
     * list of observed locals
     */
    private locals: Local[] = [];

    constructor() {
        super();
    }

    /**
     *
     * @param name name of the local
     * @param local the local to add
     */
    public add(name: string, local: object): Local {
        // if there's already throw an error in dev mode

        stage.test(StageLevel.DEV, () => {
            if (this.get(name)) {
                throw new Error(`Local ${name} is already exist`);
            }
        });

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
    public use(name: string): Local {

        // get the local from the list
        const local = this.get(name);

        // check if the local is exist
        if (!local) {
            throw new Error('local not found, please consider add it');
        }

        // set the local is active local
        this.local = local;

        // emit a value to changeLocal event
        this.localChange.emit(local);

        log.info(`local with name ${name} is active`);

        return local;
    }
    /**
     *
     * @param name get the local by it's name from the register locals
     */
    public get(name: string) {

        // find the local
        const local = this.locals.find((loc) => loc.name === name);

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

const translation = new Translation();
// export the created instance, it must be a singelton
export { translation };

// scoping not allowed until i18n service resolved in api module

/**
 *
 * @param key the key that hold the value
 * @returns the value of the key from the active local
 */
export function translate(key: string, params: object = {}) {
    let value = translation.local.get(key);
    const rawParams = value.match(/\{(.*?)\}/ig);
    if (rawParams) {
        value = rawParams.reduce((acc, el) => {
            const param = el.substring(1, el.length - 1);
            return `${acc}${value.replace(/\{(.*?)\}/, params[param])}`;
        }, '');
    }
    return value;
}
