import request = require('supertest');
declare global {
    namespace NodeJS {
        interface Global {
            JestRequest: ReturnType<typeof request>;
        }
    }
    const JestRequest: ReturnType<typeof request>;
}