import * as express from 'express';
import { InjectionToken } from 'tiny-injector';

export const EXPRESS_TOKEN = new InjectionToken<ReturnType<typeof express>>(
  'EXPRESS_TOKEN'
);

// FIXME to be removed, fayona should be build upon abstraction
