import csv = require('csv-parser');
import fs = require('fs');
import path = require('path');
import Sequelize = require('sequelize');

// sequelize.query(`SELECT * FROM orders WHERE request_time BETWEEN '2019-04-02 21:00:00' AND '2019-04-02 21:00:01'`).then(console.log)
export class Orders extends Sequelize.Model { }
export const init = (sequelize: Sequelize.Sequelize) => Orders.init({
    source: { type: Sequelize.INTEGER },
    order_id: { type: Sequelize.DOUBLE },
    request_time: { type: Sequelize.DATE },
    platform: { type: Sequelize.INTEGER },
    underlying_client: { type: Sequelize.STRING },
    account: { type: Sequelize.STRING },
    side: { type: Sequelize.INTEGER },
    symbol: { type: Sequelize.STRING },
    instrument_type: { type: Sequelize.DOUBLE },
    type: { type: Sequelize.DOUBLE },
    size: { type: Sequelize.DOUBLE },
    size_usd: { type: Sequelize.DOUBLE },
    price: { type: Sequelize.DOUBLE },
    markup: { type: Sequelize.DOUBLE },
    status: { type: Sequelize.DOUBLE },
    fill_size: { type: Sequelize.DOUBLE },
    fill_size_usd: { type: Sequelize.DOUBLE },
    fill_price: { type: Sequelize.DOUBLE },
    message: { type: Sequelize.STRING },
    exec_time: { type: Sequelize.DATE },
    is_mt4_trade: { type: Sequelize.DOUBLE },
    mt4_ticket: { type: Sequelize.DOUBLE },
    mt4_side: { type: Sequelize.DOUBLE },
    mt4_comment: { type: Sequelize.STRING }
}, { sequelize, modelName: 'orders' });

// sequelize.sync()
//     .then(() => {
//         const stream = fs.createReadStream(path.join(__dirname, '/grm_orders.csv'))
//             .pipe(csv())
//             .on('data', (data) => {
//                 stream.pause();
//                 console.log(data);
//                 delete data.order_ref;
//                 delete data.client;
//                 delete data.account;
//                 Orders.create(data)
//                     .then(data => {
//                         stream.resume();
//                     });
//             })
//             .on('end', () => { })
//             .on('error', console.log);
//     });

// import mysql from './mysql';
// import * as orders from './orders';
// import { Op } from 'sequelize';
// const sequelize = mysql.load();
// orders.init(sequelize)
// let index = 0;
// this.application.get('/data', (req, res) => {
// setInterval(() => {
//     log.warn(index);
//     orders.Orders
//         .findAll({
//             where: {
//                 request_time: {
//                     [Op.between]: ['2019-04-02T21:00:00.000Z', `2019-04-02T21:00:0${++index}.000Z`]
//                 }

//             }
//         }).then(e => {
//             console.log(JSON.stringify(e, undefined, 8))
//         });
//     // res.json(json);
// }, 5000);
// });
