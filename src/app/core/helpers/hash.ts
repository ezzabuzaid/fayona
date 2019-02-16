import { Logger } from '@core/utils';
import bcrypt = require('bcryptjs')
import { ErrorResponse } from './response.model';

// extends the bcrypt
const log = new Logger('Hash service');
export class HashService {

    constructor() {
        log.info('Hash service constructor !');
    }

    private static hashText(text) {
        return bcrypt.hash(text, 10);
    }

    static hashPassword(text) {
        // try {
        // } catch (error) {
        //     log.error('an error accured while hashing the password');
        //     throw new ErrorResponse(error);
        // }

        log.info('Start hashing password');
        return this.hashText(text);
    }

    static comparePassword(candidatePassword, actualPassword) {
        log.info('Start comparePassword');
        return bcrypt.compare(candidatePassword, actualPassword);

        // try {
        //     log.info('Start comparePassword');
        //     return bcrypt.compare(candidatePassword, actualPassword);
        // } catch (error) {
        //     log.error('an error accured while hashing the password');
        //     throw new ErrorResponse(error);
        // }
    }

}
