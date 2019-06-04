export class Observer {
    // The observer here might be a component! any thing that interest in subject notification
    constructor(subject) {
        // Here an observer forced to registed it self to some tobic
        // subject.subscribe(this);
        subject.subscribe((arg) => { console.log(arg); });
    }
    public update(notifcation) {
        // Code Here
    }
}
// Observer Pattern
// E.g:: an author write a book, and there's a people interset in getting a latest news from him,
//  so they can subscribe or unsubscribe from getting the news.

// Defention:: Maintain a list of observers and called an inner method called update (Broadcast)
//  when a notifcation arrived (change in subject state)

export class Subject {
    public observers = [];
    constructor() { }

    public countObservers() {
        return this.observers.length;
    }

    public get(observer: Observer | number) {
        if (typeof observer === 'number') {
            return this.observers[observer];

        }
        return this.observers.find((_observer) => _observer === observer);

    }

    public subscribe(observer) {
        this.observers.push(observer);
    }

    public unsubscribe(observer) {
        const index = this.observers.findIndex((_observer) => _observer === observer);
        return this.observers.splice(index, 1);
    }

    public notify(notifcation) {
        this.observers.forEach((observer) => observer.update(notifcation));
    }

}

// As problem this pattern allow one to one relationship, so the observer can only register in one subject
// but you can to register it to another, but no sense to do sense the handler in mostly situion cannot work with both (As a logic)
// publish / subscriber solved this.
