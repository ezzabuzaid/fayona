import { Server } from "./app/server";

import { Logger } from "./app/core/utils/logger.service";
import postman from '@lib/postman/postman';
const log = new Logger('Main begain');

Server.bootstrap(null)
// .then(() => log.info('Bootstrap begain'))
process.chdir('./src/');

