import { Server } from "./app/server";
import { EnvirnomentStages } from '@environment/env';
Server.bootstrap(null, EnvirnomentStages.DEV);
process.chdir('./src/');
