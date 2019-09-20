require("ts-node/register");
require('tsconfig-paths/register');
const NodeEnvironment = require('jest-environment-node');
const { NodeServer } = require('../app/server');
class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const [app] = await NodeServer.test();
    this.global.client = request(app);
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


// TODO function to get token without write the same function all the time
// function configurtion({ id, token, endpoint }) {
//     return { id, token, endpoint };
// }

const request = require('supertest');
const express = require('express');

const app = express();

app.get('/user', function (req, res) {
  res.status(200).json({ name: 'john' });
});

request(app)
  .get('/user')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end(function (err, res) {
    if (err) throw err;
  });