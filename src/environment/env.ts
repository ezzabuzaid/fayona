import { config as envConfig } from "dotenv";

import { Logger } from '../app/core/utils/logger.service';
const log = new Logger('Application instance');

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