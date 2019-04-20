import { Logger } from "./app/core/utils/logger.service";
const log = new Logger('Main begin');

import { Server } from "./app/server";
import postman from '@lib/postman/postman';

const server = Server.bootstrap(null);
// .then(() => log.info('Bootstrap begain'))
process.chdir('./src/');

