import request = require('supertest');
import { NodeServer } from 'app/server';

export const superAgent = (async () => {
    const server = await NodeServer.test();
    // TODO: connect to in-memory monog database so you don't need to call test anymore
    // and use new Application directly
    return request(server.application);
})();
