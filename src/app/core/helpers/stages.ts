import { envirnoment } from '@environment/env';
import { throws } from 'assert';

export enum StageLevel {
    LOCAL = 0,
    DEV,
    TEST,
    PROD
}

class Stage {
    private _level = null;

    load() {
        this.LEVEL = Object.values(StageLevel).find(stage => stage === +envirnoment.get('NODE_ENV')) || StageLevel.LOCAL;
    }

    get LEVEL() {
        return this._level
    }

    set LEVEL(value) {
        this._level = value
    }

    get development() {
        return StageLevel.DEV === this.LEVEL;
    }

    get production() {
        return StageLevel.PROD === this.LEVEL;
    }

    get testing() {
        return StageLevel.TEST === this.LEVEL;
    }

    test(stage: StageLevel, cb: Function) {
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