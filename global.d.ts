import request = require('supertest');


declare global {
    namespace NodeJS {
        interface Global {
            superAgent: request.SuperTest<request.Test>
        }
        export interface ProcessEnv {
            MONGO_USER: string
            MONGO_PASSWORD: string;
            MONGO_PATH: string
            JWT_SECRET_KEY: string
            NODE_STAGE: string;
            CLIENT_RESETPASSWORD_URL: string;
        }
    }
}