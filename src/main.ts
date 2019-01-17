import { Server } from "./app/server";
import { Logger } from "./app/core/utils/logger.service";
const log = new Logger('Main begain');
Server.bootstrap(null)
    .then(() => log.info('Bootstrab begain'))


process.chdir('./src/');