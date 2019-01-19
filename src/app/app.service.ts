import { Reactor } from "./core/config/reactor";

class AppService {
    _reactor = new Reactor('build');

    broadcast(value) {
        this._reactor.emit(value);
    }

    reactor(): Reactor {
        return this._reactor;
    }

}
export default new AppService();