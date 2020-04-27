require("ts-node/register");
require('tsconfig-paths/register');
const NodeEnvironment = require('jest-environment-node');
const { NodeServer } = require('../app/server');
const { Application } = require('../app/app');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

class CustomEnvironment extends NodeEnvironment {
  constructor (config) {
    NodeServer.test();
    super(config);
    this.app = (new Application()).application;
    this.global.superAgent = request(this.app);
  }

  async setup() {
    await connectToDatabase();
    await super.setup();
  }

  async teardown() {
    await closeDatabase();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;


const mongod = new MongoMemoryServer();
async function connectToDatabase() {
  const uri = await mongod.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    poolSize: 10
  };

  return mongoose.connect(uri, mongooseOpts);
}


async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoose.disconnect();
  await mongod.stop();
}
