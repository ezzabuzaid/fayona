import app = require('../app/app');
import request from 'supertest';
export default request((new app.Application()).application);
