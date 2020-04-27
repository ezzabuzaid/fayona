import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Application } from '../app/app';
import request from 'supertest';
import { NodeServer } from '../app/server';

NodeServer.test();
global.superAgent = request((new Application()).application);
let mongoServer;

beforeEach(async () => {
    await connectToDatabase();
});

afterEach(async () => {
    await closeDatabase();
});

async function connectToDatabase() {
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
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
    await mongoServer.stop();
}
