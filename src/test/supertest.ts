import request = require('supertest');
import { Application } from 'app/app';

export const superAgent = request((new Application()).application);
