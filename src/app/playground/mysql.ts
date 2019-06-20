import mysql = require('mysql');
import { Sequelize } from 'sequelize';

import { Logger } from '@core/utils';
const log = new Logger('MySql');
export class MySql {
    public load() {
        const sequelize = new Sequelize('learn', 'root', '123456789', {
            port: 3306,
            host: 'localhost',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
        return sequelize;
    }
}

export default new MySql();
