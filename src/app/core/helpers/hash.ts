import { Logger } from '@core/utils';
import bcrypt = require('bcrypt');

const log = new Logger('Hash service');
export class HashService {

    constructor() {
        log.info('Hash service constructor !');
    }

    private static hashText(password: string) {
        return bcrypt.hash(password, 12);
    }

    public static hashPassword(passowrd: string) {
        log.info('Start hashing password', typeof passowrd);
        return this.hashText(passowrd);
    }

    public static comparePassword(candidatePassword: string, actualPassword: string) {
        log.debug(typeof candidatePassword, typeof actualPassword);
        return bcrypt.compare(candidatePassword, actualPassword);
    }

}
