import { Logger } from '@core/utils';
import { connect, ConnectionOptions } from 'mongoose';

const log = new Logger('Database');

interface IMongooseURI {
    user: string;
    password: string;
    path: string;
    atlas: boolean;
    host: string;
}

class MongooseURI {
    private _user: string = null;
    private _password: string = null;
    private _path: string = null;
    private _host: string = null;
    private _atlas: boolean = false;

    constructor(option: IMongooseURI) {
        this._atlas = option.atlas;
        this._user = option.user;
        this._password = option.password;
        this._path = option.path;
        this._host = option.host;
    }

    get user() {
        return this._user ? `${this._user}:` : '';
    }
    get password() {
        return this._password || '';
    }
    get path() {
        return this._path || '';
    }
    get host() {
        return this._host ? `@${this.host}` : '';
    }
    get atlas() {
        return this._atlas;
    }
    get URI() {
        return `mongodb${!!this.atlas ? '+srv' : ''}://${this.user}${this.password}${this.host}/${this.path}`;
    }

}

export class Database {

    public static load(option: IMongooseURI, options: ConnectionOptions = {}) {
        const { URI } = new MongooseURI(option);
        return connect(URI, {
            useNewUrlParser: true,
            autoIndex: false,
            ...options
        })
            .then(() => log.info('Database Connected'))
            .catch((error) => log.error('Database Not Connected', error));
    }

}
