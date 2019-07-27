import { Logger } from '@core/utils';
import bcrypt = require('bcryptjs');

const log = new Logger('Hash service');
export class HashService {

    constructor() {
        log.info('Hash service constructor !');
    }

    private static hashText(password: string) {
        return bcrypt.hash(password, 12);
    }

    public static hashPassword(passowrd: string) {
        log.info('Start hashing password');
        return this.hashText(passowrd);
    }

    public static comparePassword(candidatePassword: string, actualPassword: string) {
        log.debug(bcrypt.compareSync(candidatePassword, actualPassword));
        return bcrypt.compare(candidatePassword, actualPassword);
    }

}
