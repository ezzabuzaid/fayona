"use strict";
exports.__esModule = true;
var Broadcast = /** @class */ (function () {
    /**
     *
     * @param name the name of the event
     */
    function Broadcast(name) {
        this.callbacks = [];
        this.name = name;
    }
    /**
     *
     * @param func the callback function to execute when a value emitted
     */
    Broadcast.prototype.registerCallback = function (func) {
        this.callbacks.push(func);
    };
    return Broadcast;
}());
var Reactor = /** @class */ (function () {
    /**
     *
     * @param name the name of the event
     */
    function Reactor(name) {
        this.event = new Broadcast(name);
        this.name = name;
        Reactor.events.push(this.event);
        this.index = Reactor.eventsCount++;
    }
    Reactor.getEvent = function (name) {
        var event = this.events.find(function (event) { return event.name === name; });
        if (!event)
            throw new Error('Event cannot find!');
        return event;
    };
    Reactor.listen = function (name, func) {
        var event = this.getEvent(name);
        event.registerCallback(func);
    };
    /**
     *
     * @param value argument to send to callbacks
     */
    Reactor.prototype.emit = function (value) {
        this.event.callbacks.forEach(function (func) { return func(value); });
    };
    /**
     *
     * @param func register a new callback
     */
    Reactor.prototype.register = function (func) {
        this.event.registerCallback(func);
    };
    /**
     * This will remove the event from the event list
     * and remove the event itself that was create implicitly in the constructor
     * until now an error will be thrown if the reactory try to emit after unsubscribe
     */
    Reactor.prototype.unregister = function () {
        var ref = Reactor.events.splice(this.index, 1)[0];
        ref = null;
        this.event = null;
    };
    /**
     * List of all event
     */
    Reactor.events = [];
    Reactor.eventsCount = 0;
    return Reactor;
}());
exports.Reactor = Reactor;
