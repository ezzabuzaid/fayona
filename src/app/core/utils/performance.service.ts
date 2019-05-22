import { performance } from "perf_hooks";
import { AppUtils } from './utils.service';

export class StopWatch extends AppUtils.getTypeOf<typeof performance>(performance) {
    startTime = 0;
    stopTime = 0;
    running = false;

    start() {
        this.startTime = this.now();
        this.running = true;
    }

    stop() {
        this.stopTime = this.now();
        this.running = false;
    }

    getElapsedMilliseconds() {
        if (this.running) {
            this.stopTime = this.now();
        }
        return this.stopTime - this.startTime;
    }

    getElapsedSeconds() {
        return this.getElapsedMilliseconds() / 1000;
    }

    printElapsed(name?: string) {
        var currentName = name || 'Elapsed:';
        console.log(currentName, '[' + this.getElapsedMilliseconds() + 'ms]', '[' + this.getElapsedSeconds() + 's]');
    }

}
