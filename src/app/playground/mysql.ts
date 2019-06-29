// import mysql = require('mysql');
// import { Sequelize } from 'sequelize';

// import { Logger } from '@core/utils';
// const log = new Logger('MySql');
// export class MySql {
//     public load() {
//         const sequelize = new Sequelize('learn', 'root', '123456789', {
//             port: 3306,
//             host: 'localhost',
//             dialect: 'mysql',
//             pool: {
//                 max: 5,
//                 min: 0,
//                 idle: 10000
//             }
//         });
//         return sequelize;
//     }
// }

// export default new MySql();

//         // const sequelize = mysql.load();
//         // orders.init(sequelize);

//         // this.application.get('/data', (req, res) => {
//         // tslint:disable-next-line: max-line-length
//         // REVIEW  check for data each seconds {https://technology.amis.nl/2017/02/13/kafka-streams-and-nodejs-consuming-and-periodically-reporting-in-node-js-on-the-results-from-a-kafka-streams-streaming-analytics-application/}
//         // NOTE cache the recent result and append them to the newest one since the result should be cumulative
//         // _O_().then((list) => {
//         // res.json(list.map((_) => _.get('request_time')));
//         // });
//         // });

//         // const time = {
//         //     second: 0,
//         //     minute: 0,
//         //     hour: 21
//         // };
//         // function _O_() {
//         //     const formatDate = (() => {
//         //         ++time.second;
//         //         if (time.second > 59) {
//         //             ++time.minute;
//         //             time.second = 0;
//         //         }
//         //         if (time.minute > 59) {
//         //             ++time.hour;
//         //             time.minute = 0;
//         //         }
//         //         if (time.hour > 23) {
//         //             time.hour = 0;
//         //             // increase the Day.
//         //         }
//         //         return { ...time };
//         //     })();
//         //     const offset = (new Date()).getTimezoneOffset() / -60;
//         //     const atMust = new Date(2019, 4 - 1, 2, formatDate.hour + offset, formatDate.minute, formatDate.second, 0);
//         //     log.warn(atMust);
//         //     return orders.Orders
//         //         .findAll({
//         //             where: {
//         //                 request_time: {
//         //                     [Op.between]: ['2019-04-02T21:00:00.000Z', atMust]
//         //                 }
//         //             }
//         //         });
//         // }
//         // setInterval(() => {
//         // _O_()
//         //     .then((list) => list.map((_) => _.get('request_time')))
//         //     .then(console.log);
//         // }, 5000);
//         // const producer = new Kafka.Producer({
//         //     connectionString: process.env.KAFKA_URL
//         //   });
//         // const kafka = new Kafka.HighLevelProducer({
//         //     clientId: 'my-app',
//         //     brokers: ['kafka:9092']
//         // });
//         // const producer = new Kafka.Producer({
//         //     connectionString: 'kafka:9092'
//         // });
//         // producer.init()
//         //     .then(_O_)
//         //     .then((list) => list.map((_) => _.get('request_time')))
//         //     .then((value) => {
//         //         return producer.send({
//         //             topic: 'sales-topic',
//         //             partition: 0,
//         //             message: {
//         //                 value: (value as any)
//         //             }
//         //         });
//         //     }).catch(console.log);

//         // const consumer = kafka.consumer({ groupId: 'test-group' })

//         // await consumer.connect()
//         // await consumer.subscribe({ topic: 'test-topic' })

//         // await consumer.run({
//         //     eachMessage: async ({ topic, partition, message }) => {
//         //         console.log({
//         //             value: message.value.toString(),
//         //         })
//         //     },
//         // })
