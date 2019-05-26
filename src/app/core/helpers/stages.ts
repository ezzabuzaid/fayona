import { EnvirnomentStages } from '@environment/env';

class Stage {
    private _level = null;

    get LEVEL() {
        return this._level
    }

    set LEVEL(value) {
        this._level = value
    }

    get development() {
        return EnvirnomentStages.DEV === this.LEVEL;
    }

    get production() {
        return EnvirnomentStages.PROD === this.LEVEL;
    }

    get testing() {
        return EnvirnomentStages.TEST === this.LEVEL;
    }

    test(stage: EnvirnomentStages, cb: Function) {
        if (stage === this.LEVEL) {
            cb();
        }
    }
}
export const stage = new Stage;

// FIXME REMOVE
export function development(cb: Function) {
    if (stage.development) {
        cb();
    }
}
// FIXME REMOVE
export function production(cb: Function) {
    if (stage.production) {
        cb();
    }
}
// FIXME REMOVE
export function testing(cb: Function) {
    if (stage.testing) {
        cb();
    }
}