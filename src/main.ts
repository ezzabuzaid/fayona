import { Logger } from './utils';
const log = new Logger('MAIN');

function main() {
    log.info('Node verions is => ', process.version);
    log.info('envirnoment =>', process.env.NODE_ENV);
}

main();
