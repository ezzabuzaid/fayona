require("ts-node/register");
require('tsconfig-paths/register');

const { Server } = require('./src/app/server');
// import { Server } from '../src/app/server';
const NodeEnvironment = require('jest-environment-node');
const request = require('supertest');

class CustomEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
        this.global.JestRequest = (async () => {
            const server = await Server.test();
            return request(server.application);
        })();
    }

    async setup() {
        await super.setup();
    }

    async teardown() {
        await super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = CustomEnvironment;

