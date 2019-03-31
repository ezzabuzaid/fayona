import mongoose = require('mongoose');
import { Logger } from '@core/utils';

const log = new Logger('Database');

export class Database  {
    constructor() {}
    static load(){
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        return mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-hp3qr.mongodb.net/${MONGO_PATH}`, {
            useNewUrlParser: true,
            autoIndex: false
        })
            .then(() => log.info('Database Connected'))
            .catch((error) => log.error("Database Not Connected", error))
    }
}
