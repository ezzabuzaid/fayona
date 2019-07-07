import { NODE_STAGE, stage, StageLevel } from '@core/helpers';
import { AppUtils, Logger } from '@core/utils';
import { config as envConfig } from 'dotenv';
import { join } from 'path';
const log = new Logger('Envirnoment Class');

class Envirnoment {
    public load(env?: StageLevel) {
        let envPath = '.env';
        if (!AppUtils.isNull(env)) {
            envPath = `${envPath}.${env}`;
        }
        log.warn(envPath);
        const { error, parsed } = envConfig({ path: join(__dirname, envPath) });
        if (error) {
            log.debug(error);
            throw new Error('an error accourd while loading the env file');
        }
        stage.load(this.get(NODE_STAGE) as StageLevel);
        return parsed;
    }

    public set(envKey: string, value: string) {
        const key = this.env[envKey];
        if (!key) {
            log.warn(`you're about adding a new key to the environment ${envKey}`);
        }
        this.env[envKey] = value;
        return value;
    }

    public get(envKey: string): string {
        return this.env[envKey];
    }

    get env() {
        return process.env;
    }

}

export const envirnoment = new Envirnoment();
