import { Server } from "./app/server";
import { StageLevel } from '@core/helpers';
// TODO get the proper level from terminal
Server.bootstrap(StageLevel.DEV);
process.chdir('./src/');
