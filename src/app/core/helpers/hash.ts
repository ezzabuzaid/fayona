import { Logger } from '@core/utils';
import bcrypt = require('bcrypt');

const log = new Logger('Hash service');
export class HashService {

    constructor() {
        log.info('Hash service constructor !');
    }

    public static hashAsync(text: string) {
        return bcrypt.hash(text, 12);
    }

    public static hashSync(text: string) {
        return bcrypt.hashSync(text, 12);
    }

    public static comparePassword(candidatePassword: string, actualPassword: string) {
        return bcrypt.compare(candidatePassword, actualPassword);
    }

}
