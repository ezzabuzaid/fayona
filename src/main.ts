import { Server } from "./app/server";
import { EnvirnomentStages } from '@environment/env';
Server.bootstrap(EnvirnomentStages.DEV);
process.chdir('./src/');

// import * as path from 'path'
// import tsConfig from '../tsconfig.json';

// (function () {
//     const baseUrl = path.join(process.cwd(), tsConfig.compilerOptions.baseUrl);
//     const moduleProto = Object.getPrototypeOf(module);
//     const origRequire = moduleProto.require;
//     const pathKey = {};
//     for (const [key, value] of Object.entries(tsConfig.compilerOptions.paths)) {
//         pathKey[key.slice(0, -2)] = value[0].slice(0, -2);
//     }
//     moduleProto.require = function (request) {
//         if (request[0] === '@') {
//             const pathName = request.match(/(@.*?)\//)[1];
//             const relativeToBase = path.relative(path.dirname(this.id), baseUrl);
//             const existsPath = relativeToBase + '/' + pathKey[pathName] + request.slice(pathName.length);
//             return origRequire.call(this, existsPath || request)
//         }
//         return origRequire.call(this, request);
//     };
// })();