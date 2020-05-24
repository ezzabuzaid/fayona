import { NODE_STAGE, StageLevel } from '@core/helpers';
import { AppUtils, Logger } from '@core/utils';
import { config as envConfig } from 'dotenv';
import { join } from 'path';
import stage from '@core/helpers/stage';
const log = new Logger('Envirnoment');

class Envirnoment {
    private noEnvError = false;

    public load(env?: StageLevel) {
        let envPath = '.env';
        if (AppUtils.not(stage.production) && AppUtils.notNullOrUndefined(env)) {
            envPath = `${ envPath }.${ env }`;
        }
        log.warn(envPath);
        const { error, parsed } = envConfig({ path: join(__dirname, envPath) });
        if (error) {
            if (AppUtils.not(this.noEnvError)) {
                this.load(null);
                this.noEnvError = true;
            } else {
                throw new Error('an error occured while loading the env file' + error.message);
            }
        }
        stage.load(this.get(NODE_STAGE) as StageLevel);
        return parsed;
    }

    public set(envKey: string, value: string) {
        const key = this.env[envKey];
        if (AppUtils.notNullOrUndefined(key)) {
            log.warn(`you're about adding a new key to the environment ${ envKey }`);
        }
        this.env[envKey] = value;
        return value;
    }

    public get(envKey: keyof NodeJS.ProcessEnv): string {
        return this.env[envKey];
    }

    get env() {
        return process.env;
    }

}

export const envirnoment = new Envirnoment();
