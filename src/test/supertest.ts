import request = require('supertest');
import { NodeServer } from '../app/server';

export const superAgent = (async () => {
    const [app] = await NodeServer.test();
    return request(app);
})();
