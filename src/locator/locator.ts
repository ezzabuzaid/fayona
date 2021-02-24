import "reflect-metadata";
import { Request } from 'express';
import { isArrowFn, isConstructor, isNullOrUndefined, notNullOrUndefined, Type } from '../utils';
import { ControllersStorage } from './controllers_storage';

type ServiceType = 'transient' | 'singelton' | 'scoped';
class Registry<T> {
    constructor(
        public type: ServiceType,
        public implementation: (...args: any[]) => any
    ) { }
}

interface ISingeltonService<T> {
    addSingelton(abstraction, implementation: () => any): T;
    addSingelton(abstraction: Type<any>, implementation: Type<any>): T;
    addSingelton(implementation: Type<any>): T;
}

interface ITransientService<T> {
    addTransient(abstraction, implementation: () => any): T;
    addTransient(abstraction: Type<any>, implementation: Type<any>): T;
    addTransient(implementation: Type<any>): T;
}

interface IScopedService<T> {
    addScoped(abstraction, implementation: () => any): T;
    addScoped(abstraction: Type<any>, implementation: Type<any>): T;
    addScoped(implementation: Type<any>): T;
}

export class ServiceLocator implements
    ISingeltonService<ServiceLocator>,
    ITransientService<ServiceLocator>,
    IScopedService<ServiceLocator>
{
    private static _instance: ServiceLocator;
    static instance = ServiceLocator._instance ?? (ServiceLocator._instance = new ServiceLocator());

    #abstractionImplementationRegistry = new Map<Type<any>, Registry<any>>();
    #singeltonRegistry = new WeakMap<Type<any>, Type<any>>();
    #hostScopedRequestRegistry = new WeakMap<any, Request>();
    #scopedServicesRegistry = new WeakMap<Request, WeakMap<Type<any>, InstanceType<any>>>();

    // @ts-ignore
    addSingelton(abstraction: Type<any>): ServiceLocator;
    addSingelton(abstraction: Type<any>, implementation: Type<any>): ServiceLocator;
    addSingelton(abstraction: any, implementation: () => any): ServiceLocator;
    addSingelton(abstraction: any, implementation?: any) {
        this.addService(abstraction, implementation, 'singelton');
        return this;
    }

    // @ts-ignore
    addTransient(abstraction: Type<any>): ServiceLocator;
    addTransient(abstraction: Type<any>, implementation: Type<any>): ServiceLocator;
    addTransient(abstraction: any, implementation: () => any): ServiceLocator;
    addTransient(abstraction: any, implementation?: any) {
        this.addService(abstraction, implementation, 'transient');
        return this;
    }

    // @ts-ignore
    addScoped(abstraction: Type<any>): ServiceLocator;
    addScoped(abstraction: Type<any>, implementation: Type<any>): ServiceLocator;
    addScoped(abstraction: any, implementation: () => any): ServiceLocator;
    addScoped(abstraction: any, implementation?: any) {
        this.addService(abstraction, implementation, 'scoped');
        return this;
    }

    private addService(abstraction: any, implementation: any, type: ServiceType): void {
        if (
            !isConstructor(abstraction)
            ||
            (notNullOrUndefined(implementation) && !isConstructor(implementation) && !isArrowFn(implementation))
        ) {
            throw new Error('You must either provider abstraction and implementation or only implementation as class');
        }
        const registry = this.#abstractionImplementationRegistry.get(abstraction);
        if (registry) {
            const message = `You cannot override registered types. ${ abstraction.name } already registered as ${ registry.type }`;
            throw new Error(message);
        }
        if (notNullOrUndefined(implementation)) {
            const registry = new Registry(type,
                isArrowFn(implementation)
                    ? implementation
                    // TODO: Repeat the below logic here
                    : () => new implementation()
            );
            this.#abstractionImplementationRegistry.set(abstraction, registry);
        } else {
            const tokens: Type<any>[] = Reflect.getMetadata('design:paramtypes', abstraction) ?? [];
            if (type === 'singelton') {
                tokens.forEach(token => {
                    const tokenRegistry = this.getRegistry(token);
                    if (tokenRegistry.type !== 'singelton') {
                        throw new Error(`Cannot consume ${ tokenRegistry.type } service ${ token.name } from singleton ${ abstraction.name }.`)
                    }
                })
            }
            const registry = new Registry(type, (context) => {
                return new abstraction(
                    ...tokens.map(token => this.locate(token, context))
                );
            });
            this.#abstractionImplementationRegistry.set(abstraction, registry);
        }
    }

    static async createScope(computation: (context: object) => Promise<void> | void) {
        const context = new Object() as any;
        const locator = ServiceLocator.instance;
        locator.#scopedServicesRegistry.set(context, new WeakMap());
        await computation(context);
        locator.#scopedServicesRegistry.delete(context);
    }

    public locateScoped<T>(context: InstanceType<any>, abstraction: Type<T>, registry: Registry<T>) {
        if (isNullOrUndefined(context)) {
            throw new Error(`${ abstraction.name } Cannot be resolved without context`);
        }
        const scopedRegistry = this.#scopedServicesRegistry.get(context);
        if (scopedRegistry.has(abstraction)) {
            return scopedRegistry.get(abstraction);
        }
        const instance = registry.implementation(context);
        scopedRegistry.set(abstraction, instance);
        return instance;
    }

    public getRegistry<T>(abstraction: Type<T>) {
        const registry = this.#abstractionImplementationRegistry.get(abstraction);
        if (isNullOrUndefined(registry)) {
            throw new Error(`${ abstraction.name } is not registered in the locator.`);
        }
        return registry;
    }

    // @ts-ignore
    locate<T>(type: Type<T>): T;
    locate<T>(type: Type<T>, context: InstanceType<any>): T;
    locate<T>(
        abstraction: Type<T>,
        context: InstanceType<any>,
    ): T {
        const registry = this.getRegistry(abstraction);
        switch (registry.type) {
            case 'singelton':
                return this.locateSingelton(abstraction, registry);
            case 'transient':
                return this.locateTransient(registry);
            case 'scoped':
                return this.locateScoped(context, abstraction, registry);
            default:
                throw new Error('Service Type is not registered.');
        }
    }

    private locateSingelton<T>(abstraction: Type<T>, registry: Registry<T>) {
        if (this.#singeltonRegistry.has(abstraction)) {
            return this.#singeltonRegistry.get(abstraction);
        }
        const instance = registry.implementation();
        this.#singeltonRegistry.set(abstraction, instance);
        return instance;
    }

    private locateTransient<T>(registry: Registry<T>) {
        const instance = registry.implementation();
        return instance;
    }

}
