import { config as envConfig } from "dotenv";

import { Logger } from '@core/utils';
const log = new Logger('Envirnoment Class');

class Envirnoment {
    static load(state = '') {
        const { error, parsed } = envConfig({ path: `./src/environment/.env${state}` });
        if (error) {
            new Error('an error accourd while loading the env file')
        }
        log.info('Envirnoment file loaded');
        return parsed;
    }
}

export const environment = Envirnoment