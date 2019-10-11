import { Logger } from '@core/utils';
import { connect, ConnectionOptions, Mongoose, Connection } from 'mongoose';

const log = new Logger('Database');

interface IMongooseOptions {
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

    constructor(option: IMongooseOptions) {
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
        return this._host ? `@${this._host}` : '';
    }
    get atlas() {
        return this._atlas;
    }
    get URI() {
        return `mongodb${!!this.atlas ? '+srv' : ''}://${this.user}${this.password}${this.host}/${this.path}`;
    }

}

export class Database {

    public static load(
        mongooseOption: IMongooseOptions,
        connectionOptions: ConnectionOptions = {}
    ): Promise<Connection> {
        const { URI } = new MongooseURI(mongooseOption);
        log.info(URI);
        return connect(URI, {
            useNewUrlParser: true,
            autoIndex: false,
            w: 'majority',
            ...connectionOptions
        })
            .then((connection) => {
                log.info('Database Connected');
                return connection.connection;
            })
            .catch((error) => {
                log.error('Database Not Connected', error);
                return null as any;
            });
    }

}
