import { Logger } from '@core/utils';
import { envirnoment } from '@environment/env';
import { registerSocket } from '@shared/common';
import yargs from 'yargs';
import { NodeServer } from './app/server';
const log = new Logger('MAIN');

envirnoment.load(yargs.parse().env as string);
log.info('envirnoment =>', yargs.parse().env);

NodeServer.bootstrap()
    .then((server) => {
        registerSocket(server);
        log.info('Node verions is => ', process.version);
        log.info('Node title is => ', process.title);
    });
