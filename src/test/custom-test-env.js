require("ts-node/register");
require('tsconfig-paths/register');
const NodeEnvironment = require('jest-environment-node');
const { NodeServer } = require('../app/server');
class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const [app, dbConnection] = await NodeServer.test();
    const collections = dbConnection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
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
