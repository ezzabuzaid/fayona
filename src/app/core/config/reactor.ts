interface IBroadcasting {
    name: string;
    callbacks: Array<() => void>;
    index?: number;
}
class Broadcast implements IBroadcasting {
    public name: string;
    public callbacks = [];
    /**
     *
     * @param name the name of the event
     */
    constructor(name) {
        this.name = name;
    }
    /**
     *
     * @param func the callback function to execute when a value emitted
     */
    public registerCallback(func) {
        this.callbacks.push(func);
    }
}
export class Reactor {
    private event: Broadcast;
    private name: string;
    private index: number;
    /**
     *
     * @param name the name of the event
     */
    constructor(name: string) {
        this.event = new Broadcast(name);
        this.name = name;
        this.index = Reactor.eventNumber++;
        Reactor.events.push(this.event);
    }
    /**
     * List of all event
     */
    private static events: Broadcast[] = [];

    private static eventNumber = 0;

    private static getEvent(name: string) {
        const event = this.events.find((_event) => _event.name === name);
        if (!event) { throw new Error('Event cannot find!'); }
        return event;
    }

    public static listen(name: string, func: () => void) {
        const event = this.getEvent(name);
        event.registerCallback(func);
    }

    /**
     *
     * @param value argument to send to callbacks
     */

    public emit(value) {
        this.event.callbacks.forEach((func) => func(value));
    }

    /**
     *
     * @param func register a new callback
     */
    public register(func) {
        this.event.registerCallback(func);
    }

    /**
     * This will remove the event from the event list
     * and remove the event itself that was create implicitly in the constructor
     * until now an error will be thrown if the reactory try to emit after unsubscribe
     */
    public unregister() {
        let ref = Reactor.events.splice(this.index, 1)[0];
        ref = null;
        this.event = null;
    }
}

// NOTE remove event is diffrent from unregister
// unregister mean remove the passed function, therefore it will not be fired because it's removed
// remove mean, delete the event it self
