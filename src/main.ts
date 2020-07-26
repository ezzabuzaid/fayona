import { Logger } from '@core/utils';
import { registerSocket } from '@shared/common';
import { NodeServer } from './app/server';
const log = new Logger('MAIN');
NodeServer.bootstrap()
    .then((server) => {
        registerSocket(server);
        log.info('Node verions is => ', process.version);
        log.info('Node title is => ', process.title);
    });
