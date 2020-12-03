import { Envirnoment } from './environment';
import { locate } from 'locator';
import { Logger } from 'utils';
import yargs from 'yargs';
const log = new Logger('MAIN');


async function main(args) {
    // Load the envirnoment based on givin <env> argument from command line
    // defaults to empty
    const envirnoment = locate(Envirnoment);
    envirnoment.load(args.env);

    log.info('Node verions is => ', process.version);
    log.info('Node title is => ', process.title);
    log.info('envirnoment =>', envirnoment.get('NODE_ENV'));

}


main(yargs.parse());