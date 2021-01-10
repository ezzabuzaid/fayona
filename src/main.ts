import { Envirnoment } from './environment';
import { Logger } from './utils';
const log = new Logger('MAIN');


export function bootstrap() {
    const nodeEnv = process.env.NODE_ENV;
    Envirnoment.load(nodeEnv);

    log.info('Node verions is => ', process.version);
    log.info('envirnoment =>', nodeEnv);

}
