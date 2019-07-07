import { envirnoment } from '@environment/env';
import { throws } from 'assert';

export enum StageLevel {
    LOCAL = 'local',
    DEV = 'dev',
    TEST = 'test',
    PROD = 'prod'
}

class Stage {
    private _level = null;

    public load(env) {
        this.LEVEL = env || StageLevel.LOCAL;
    }

    public get LEVEL() {
        return this._level;
    }

    public set LEVEL(value) {
        this._level = value;
    }

    public get development() {
        return StageLevel.DEV === this.LEVEL;
    }

    public get production() {
        return StageLevel.PROD === this.LEVEL;
    }

    public get testing() {
        return StageLevel.TEST === this.LEVEL;
    }

    public test(_stage: StageLevel, cb: () => void) {
        if (_stage === this.LEVEL) {
            cb();
        }
    }
}
export const stage = new Stage();

// FIXME REMOVE
export function development(cb: () => void) {
    if (stage.development) {
        cb();
    }
}
// FIXME REMOVE
export function production(cb: () => void) {
    if (stage.production) {
        cb();
    }
}
// FIXME REMOVE
export function testing(cb: () => void) {
    if (stage.testing) {
        cb();
    }
}
