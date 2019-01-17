interface Broadcasting {
    name: string;
    callbacks: Function[];
    index?: number;
}
class Broadcast implements Broadcasting {
    name: string;
    callbacks = [];
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
    registerCallback(func) {
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
        Reactor.events.push(this.event);
        this.index = Reactor.eventsCount++;
    }
    /**
     * List of all event 
     */
    private static events: Broadcast[] = [];
    private static eventsCount = 0;
    private static getEvent(name: string) {
        const event = this.events.find(event => event.name === name);
        if (!event) throw new Error('Event cannot find!');
        return event;
    }
    static listen(name: string, func: Function) {
        const event = this.getEvent(name);
        event.registerCallback(func);
    }
    /**
     * 
     * @param value argument to send to callbacks
     */
    emit(value) {
        this.event.callbacks.forEach(func => func(value));
    }
    /**
     * 
     * @param func register a new callback
     */
    register(func) {
        this.event.registerCallback(func);
    }
    /**
     * This will remove the event from the event list
     * and remove the event itself that was create implicitly in the constructor
     * until now an error will be thrown if the reactory try to emit after unsubscribe
     */
    unregister() {
        let ref = Reactor.events.splice(this.index, 1)[0];
        ref = null;
        this.event = null;
    }
}
