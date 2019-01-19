import { Logger } from '@core/utils';
const log = new Logger('Hash service');
import bcrypt = require('bcryptjs')

// extends the bcrypt
export class HashService {

    constructor() {
        log.info('Hash service constructor !');
    }

    private static hashText(text) {
        return bcrypt.hash(text, 10);
    }

    static async hashPassword(text) {
        try {
            log.info('Start hashing password');
            return await this.hashText(text);
        } catch (error) {
            log.error('an error accured while hashing the password');
            throw new Error(error);
        }
    }

    static async comparePassword(candidatePassword, actualPassword) {
        try {
            log.info('Start hashing password');
            return await bcrypt.compare(candidatePassword, actualPassword);
        } catch (error) {
            log.error('an error accured while hashing the password');
            throw new Error(error);
        }
    }

}
