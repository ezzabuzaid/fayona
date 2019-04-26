import { Logger } from "./app/core/utils/logger.service";
const log = new Logger('Main begin');

import { Server } from "./app/server";

const server = Server.bootstrap(null);
process.chdir('./src/');

