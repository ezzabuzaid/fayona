import request = require('supertest');
import { Server } from './src/app/server';

// FIXME Workaround until this issue fixed
// https://github.com/facebook/jest/issues/8479
let c = -1;
export const JestRequest = async function () {
    const { application } = (await Server.test());
    console.log('Excuted time', ++c);
    return request(application);
}