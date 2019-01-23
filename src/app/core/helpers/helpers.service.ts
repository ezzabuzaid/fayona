import { Server } from 'app/server';

export enum ServerLevels {
    OFF = 0,
    DEV,
    TEST,
    STAGE,
    PROD
}

export function development(cb, level = Server.LEVEL) {
    if (ServerLevels.DEV <= level) {
        cb();
    }
}

export function production(cb, level = Server.LEVEL) {
    if (ServerLevels.PROD <= level) {
        cb();
    }
}

export function staging(cb, level = Server.LEVEL) {
    if (ServerLevels.STAGE <= level) {
        cb();
    }
}

export function testing(cb, level = Server.LEVEL) {
    if (ServerLevels.TEST <= level) {
        cb();
    }
}
