import { config as envConfig } from "dotenv";
import { join, posix } from 'path';
import { Logger } from '@core/utils';
import { StageLevel } from '@core/helpers';
const log = new Logger('Envirnoment Class');

class Envirnoment {
    load(stage?: StageLevel) {
        let envPath = '.env';
        if (!!stage) {
            envPath = `${envPath}.${stage}`;
        }
        log.warn(envPath);
        const { error, parsed } = envConfig({ path: join(__dirname, envPath) });
        if (error) {
            log.debug(error);
            throw new Error('an error accourd while loading the env file');
        }
        return parsed;
    }

    set(envKey: string, value: string) {
        const key = this.env[envKey];
        if (!key) {
            log.warn(`you're about adding a new key to the environment ${envKey}`);
        }
        this.env[envKey] = value;
        return value;
    }

    get(envKey: string): string {
        return this.env[envKey];
    }

    get env() {
        return process.env;
    }

}

export const envirnoment = new Envirnoment;
