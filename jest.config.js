module.exports = {
  "roots": [
    "./src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
// const { config } = require("dotenv");


// export class Envirnoment {
//   static load(state = '') {
//     const { error, parsed } = envConfig({ path: `./src/environment/.env${state}` });
//     if (error) {
//       throw new Error('an error accourd while loading the env file')
//     }
//     log.info('Envirnoment file loaded');
//     return parsed;
//   }
// }
