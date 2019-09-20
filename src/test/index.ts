export * from './supertest';
// import request = require('supertest');
// import { NodeServer } from './src/app/server';
// import * as jest from 'jest';
// import { ProjectConfig } from '@jest/types/build/Config';

// // FIXME Workaround until this issue fixed
// // https://github.com/facebook/jest/issues/8479
// let c = -1;
// export async function JestRequest() {
//     const [application] = (await NodeServer.test());
//     console.log('Excuted time', ++c);
//     return request(application);
// }

// async function setup() {
//     return new Promise<void>((resolve, reject) => {
//         setTimeout(() => {
//             console.log('Init finished');
//             resolve();
//         }, 1000);
//     });
// }

// async function teardown() {
//     console.log('End of tests - Execute something');
// }

// import tsconfig = require('./tsconfig.json');
// console.log(tsconfig);
// // const { compilerOptions: { baseUrl, paths } } = tsconfig;
// // const fromPairs = (pairs) => pairs.reduce((res, [key, value]) => ({ ...res, [key]: value }), {});
// // // tslint:disable-next-line: max-line-length
// // const moduleNameMapper = fromPairs(
    // Object.entries(paths).map(([k, [v]]) => [k.replace(/\*/, '(.*)'), 
    // `<rootDir>/${baseUrl}/${v.replace(/\*/, '$1')}`,]));

// // const projectRootPath = '/path/to/project/root';
// // type ArgumentTypes<T extends (...args: any) => any> = T extends (f: infer A, ...args) => any ? A : never;
// // const jestConfig: Partial<ArgumentTypes<typeof jest.runCLI>> = {
// //     roots: ['./src'],
// //     transform: JSON.stringify({ '^.+\\.tsx?$': 'ts-jest' }),
// //     testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
// //     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
// //     moduleNameMapper,
// //     testEnvironment: 'node'
// // };

// // setup()
// //     .then(jest.runCLI.bind(jest.runCLI, jestConfig, [projectRootPath]))
// //     .then(console.log)
// //     .then(teardown)
// //     .catch((e) => console.error(e));
