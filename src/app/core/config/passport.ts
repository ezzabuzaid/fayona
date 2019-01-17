import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { Model } from 'mongoose';
import { Application } from 'express';
import { UsersModel } from '../../api/users/users.model';

export class LocalStrategy extends Strategy {
    constructor() {
        super((username, password, done) => { return this.use(username, password, done); })
    }

    private use(username, password, done) {
        UsersModel.findOne({ username })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.comparePassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            })
            .catch(error => {
                return done(error);
            })
    }

}


export class Passport extends passport.Passport {
    constructor(app: Application) {
        super();
        app.use(passport.initialize())
        this.use(new LocalStrategy())
    }
}
// not used