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
    private stage = null;

    public load(env: StageLevel) {
        this.stage = env || StageLevel.LOCAL;
    }

    public get development() {
        return StageLevel.DEV === this.stage;
    }

    public get production() {
        return StageLevel.PROD === this.stage;
    }

    public get testing() {
        return StageLevel.TEST === this.stage;
    }

    public test(
        stage: StageLevel,
        ifCallback: () => void,
        elseCallback = () => { }
    ) {
        if (stage === this.stage) {
            ifCallback();
        } else {
            elseCallback();
        }
    }
}
export default new Stage();
