import express from 'express';
import { InjectionToken } from "tiny-injector";
export const EXPRESS_TOKEN = new InjectionToken<ReturnType<typeof express>>('EXPRESS_TOKEN');
