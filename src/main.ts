import { Logger } from "tslog";

const logger = new Logger({ name: 'MAIN' });

function main() {
    logger.info('Node verions is => ', process.version);
    logger.info('envirnoment =>', process.env.NODE_ENV);
}

main();
