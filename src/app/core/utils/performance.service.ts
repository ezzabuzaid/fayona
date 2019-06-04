import { performance } from 'perf_hooks';
import { AppUtils } from './utils.service';

export class StopWatch extends AppUtils.getTypeOf<typeof performance>(performance) {
    public startTime = 0;
    public stopTime = 0;
    public running = false;

    public start() {
        this.startTime = this.now();
        this.running = true;
    }

    public stop() {
        this.stopTime = this.now();
        this.running = false;
    }

    public getElapsedMilliseconds() {
        if (this.running) {
            this.stopTime = this.now();
        }
        return this.stopTime - this.startTime;
    }

    public getElapsedSeconds() {
        return this.getElapsedMilliseconds() / 1000;
    }

    public printElapsed(name?: string) {
        let currentName = name || 'Elapsed:';
        console.log(currentName, '[' + this.getElapsedMilliseconds() + 'ms]', '[' + this.getElapsedSeconds() + 's]');
    }

}
