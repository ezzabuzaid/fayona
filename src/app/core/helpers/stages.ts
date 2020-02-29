export enum StageLevel {
    LOCAL = 'local',
    DEV = 'development',
    TEST = 'test',
    PROD = 'production'
}

/**
 * NODE_STAGE name must be identical in .env*. files
 */
export const NODE_STAGE = 'NODE_STAGE';

class Stage {
    private _level = null;

    public load(env: StageLevel) {
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

    public test(
        _stage: StageLevel,
        ifCallback: () => void,
        elseCallback = () => { }
    ) {
        if (_stage === this.LEVEL) {
            ifCallback();
        } else {
            elseCallback();
        }
    }
}
export const stage = new Stage();
