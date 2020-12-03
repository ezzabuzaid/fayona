import { Singelton } from './locator';
import { config as envConfig } from 'dotenv';
import path from 'path';
import { Logger, notNullOrUndefined } from 'utils';
const log = new Logger('Envirnoment');

export enum EStage {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test'
}

/**
 * NODE_ENV name must be identical in .env*. files
 */
const NODE_ENV = 'NODE_ENV';

@Singelton()
export class Envirnoment {
    /**
     * Load the envirnoment file and merge with proccess.env using dotenv package
     * 
     * @param env is the suffix that comes after the dot(.) in filename
     * 
     * eg if the file name if .env.dev so you only will pass the 'dev'
     * 
     * Usually, you'll not explictly use this method, it will be used only once during build/run
     */
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
        if (notNullOrUndefined(key)) {
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

}
