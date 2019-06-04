// process.env.NODE_ENV = 'test';
// process.env.PUBLIC_URL = '';

// const jest = require('jest');
// const argv = process.argv.slice(2);
// argv.push('--coverage');

// // Watch unless --no-watch or running in CI
// if (argv.indexOf('--no-watch') == -1 && !process.env.CI) {
//   argv.push('--watchAll');
// }

// jest.run(argv);
import request = require('supertest');
// declare global {
//     namespace NodeJS {
//         interface Global {
//             JestRequest: ReturnType<typeof request>;
//         }
//     }
// }

// console.log(global.JestRequest);

import * as jest from 'jest';
async function setup() {
    // return new Promise<void>((resolve, reject) => {
    //     resolve();
    // });
}

async function teardown() {
    console.log('End of tests - Execute something');
}
// const run = jest.run as unknown as Promise<any>;
// setup()
//     .then(run as any)
//     .then(teardown)
//     .catch(console.error);

