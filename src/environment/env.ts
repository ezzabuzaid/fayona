import { config as envConfig } from "dotenv";
import { join, posix } from 'path';
import { Logger } from '@core/utils';
const log = new Logger('Envirnoment Class');

class Envirnoment {
    load(state = EnvirnomentStages.DEV) {
        const { error, parsed } = envConfig({ path: join(__dirname, `.env.${state}`) });
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
export enum EnvirnomentStages {
    DEV = 'dev',
    TEST = 'test',
    PROD = 'prod'
}
export const envirnoment = new Envirnoment;
