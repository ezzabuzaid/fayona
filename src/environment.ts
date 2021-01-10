import { config as envConfig } from 'dotenv';
import path from 'path';
import { locate, Singelton } from './locator';
import { Logger, notNullOrUndefined } from './utils';
const log = new Logger('Envirnoment');

enum EStage {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    Staging = 'staging'
}


@Singelton()
export class Envirnoment {
    /**
     * Load the envirnoment file and merge with proccess.env using dotenv package
     * 
     * @param nodeEnv is the suffix that comes after the dot(.) in filename
     * 
     * eg if the file name if .env.dev so you only will pass the 'dev'
     * 
     * Don't call it, it will be used only once during the application boostrap
     */
    public static load(nodeEnv: string) {
        const instance = locate(Envirnoment);
        let envPath;
        if (instance.isDevelopment) {
            // get the environments path from launchsettings.json
            envPath = path.join('src/environments', `.env${ nodeEnv ? `.${ nodeEnv }` : '' }`);
        } else {
            envPath = path.join(__dirname, `.env${ nodeEnv ? `.${ nodeEnv }` : '' }`);
        }
        const { error, parsed } = envConfig({ path: envPath });
        if (error) {
            throw new Error('loading the ' + nodeEnv + ' env file at path ' + envPath + error.message);
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


    public get isDevelopment() {
        return EStage.DEVELOPMENT === this.get('NODE_ENV')?.toLowerCase();
    }

    public get isProduction() {
        return EStage.PRODUCTION === this.get('NODE_ENV')?.toLowerCase();
    }

    public get isStaging() {
        return EStage.Staging === this.get('NODE_ENV')?.toLowerCase();
    }

}
