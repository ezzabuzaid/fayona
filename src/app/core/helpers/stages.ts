export enum StageLevel {
    DEV = 'dev',
    TEST = 'test',
    PROD = 'prod'
}

class Stage {
    private _level = null;

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