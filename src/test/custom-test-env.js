require("ts-node/register");
require('tsconfig-paths/register');
const NodeEnvironment = require('jest-environment-node');
const { NodeServer } = require('../app/server');
const { Application } = require('../app/app');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const [databaseConnection, app] = await NodeServer.test();
    this.global.superAgent = request(app);
    const collections = databaseConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    // await connectToDatabase();
    await super.setup();
  }

  async teardown() {
    // await clearDatabase();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;


const mongod = new MongoMemoryServer();
async function connectToDatabase() {
  const uri = await mongod.getConnectionString();
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };
  await mongoose.connect(uri, mongooseOpts);
}


async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}