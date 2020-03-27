import { NodeServer } from './app/server';
import { Logger } from '@core/utils';
const log = new Logger('MAIN');
NodeServer.bootstrap()
    .then(() => {
        log.info('Node verions is => ', process.version);
        log.info('Node title is => ', process.title);
    });
