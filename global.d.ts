declare namespace NodeJS {
    interface Global {
        Twilio: { Device: Partial<{}> }
    }
}

declare global {
    interface String {
        endsWith(suffix: string): boolean;
    }
}

import 'jest';
declare namespace global {
    export namespace jest {
        // tslint:disable-next-line: interface-name
        export interface It {
            todo: string;
        }
        export function addMatchers(matchers: jasmine.CustomMatcherFactories): typeof jest;
        export const client: ReturnType<typeof import('supertest')>;
    }
}
export let client: ReturnType<typeof import('supertest')>;
