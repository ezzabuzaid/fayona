import { Reactor } from "./config/reactor";

class AppService {
    _reactor = new Reactor('build');

    broadcast(value) {
        this._reactor.emit(value);
    }

    reactor(): Reactor {
        return this._reactor;
    }

}
export const appService = new AppService();
// TODO Create services folder and remove this file