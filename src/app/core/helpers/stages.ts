
import { Server } from 'app/server';
import { EnvirnomentStages } from '@environment/env';
// export enum EnvirnomentStages {
//     OFF = 0,
//     DEV,
//     TEST,
//     PROD
// }

class _Stage {
    get LEVEL() {
        return Server.LEVEL
    }

    get development() {
        return EnvirnomentStages.DEV <= this.LEVEL;
    }

    get production() {
        return EnvirnomentStages.PROD <= this.LEVEL;
    }

    get testing() {
        return EnvirnomentStages.TEST <= this.LEVEL;
    }

    test(stage: EnvirnomentStages, cb: Function) {
        if (stage === Server.LEVEL) {
            cb();
        }
    }
}
export const stage = new _Stage;

// REMOVE
export function development(cb: Function) {
    if (stage.development) {
        cb();
    }
}
// REMOVE
export function production(cb: Function) {
    if (stage.production) {
        cb();
    }
}
// REMOVE
export function testing(cb: Function) {
    if (stage.testing) {
        cb();
    }
}