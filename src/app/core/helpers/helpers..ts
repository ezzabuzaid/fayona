import { Server } from 'app/server';

export enum ServerLevel {
    OFF = 0,
    DEV,
    TEST,
    STAGE,
    PROD
}

export function development(cb, level = Server.LEVEL) {
    if (ServerLevel.DEV <= level) {
        cb();
    }
}

export function production(cb, level = Server.LEVEL) {
    if (ServerLevel.PROD <= level) {
        cb();
    }
}

export function staging(cb, level = Server.LEVEL) {
    if (ServerLevel.STAGE <= level) {
        cb();
    }
}

export function testing(cb, level = Server.LEVEL) {
    if (ServerLevel.TEST <= level) {
        cb();
    }
}
