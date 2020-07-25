import bcrypt = require('bcrypt');

export class HashHelper {

    public static hashAsync(text: string) {
        return bcrypt.hash(text, 12);
    }

    public static hashSync(text: string) {
        return bcrypt.hashSync(text, 12);
    }

    public static comparePassword(candidatePassword: string, actualPassword: string) {
        return bcrypt.compareSync(candidatePassword, actualPassword);
    }

}
