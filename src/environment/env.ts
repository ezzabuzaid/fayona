import { AppUtils, Logger } from '@core/utils';
import { config as envConfig } from 'dotenv';
import path from 'path';
const log = new Logger('Envirnoment');

export enum EStage {
    DEVELOPMENT = 'development',
    TEST = 'test',
    PRODUCTION = 'production'
}

/**
 * NODE_ENV name must be identical in .env*. files
 */
const NODE_ENV = 'NODE_ENV';

class Envirnoment {
    public load(env: string) {
        const envPath = path.join(__dirname, `.env${ env ? `.${ env }` : '' }`);
        const { error, parsed } = envConfig({ path: envPath });
        if (error) {
            throw new Error('Error: loading the ' + env + ' env file at path ' + envPath + error.message);
        }
        return parsed;
    }

    public set<key extends keyof NodeJS.ProcessEnv>(envKey: key, value: NodeJS.ProcessEnv[key]) {
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

    public get development() {
        return EStage.DEVELOPMENT === this.get(NODE_ENV);
    }

    public get production() {
        return EStage.PRODUCTION === this.get(NODE_ENV);
    }

    public get testing() {
        return EStage.TEST === this.get(NODE_ENV);
    }
}

export const envirnoment = new Envirnoment();
