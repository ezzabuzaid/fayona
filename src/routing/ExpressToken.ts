import { InjectionToken } from "@lib/dependency-injection";
import express from 'express';
export const EXPRESS_TOKEN = new InjectionToken<ReturnType<typeof express>>('EXPRESS_TOKEN');
