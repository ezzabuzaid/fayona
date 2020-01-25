import { NodeServer } from './app/server';
process.chdir('./src/');


import tsconfig from '../tsconfig.json';
import * as path from 'path'
import * as fs from 'fs'
import { AppUtils } from '../src/app/core/utils';
(function () {
    const sliceAsterisk = (url: string) => url.split('/*')[0];
    const getFilePath = (url: string) => {
        const urlParts = url.split('/');
        urlParts.splice(0, 1);
        return urlParts.join('/');
    };
    const getAliasPath = (pathAlias: string) => paths[pathAlias.split('/')[0]];

    const baseUrl = path.dirname(process['mainModule'].filename);
    console.log('baseUrl => ', baseUrl);

    const cachedCalls = {};

    const modulePrototype = Object.getPrototypeOf(module);
    const originalRequire = modulePrototype.require;

    const { paths } = tsconfig.compilerOptions;
    for (const aliasPath in paths) {
        paths[sliceAsterisk(aliasPath)] = paths[aliasPath];
        delete paths[aliasPath];
    }


    modulePrototype.require = function (request: string) {
        console.log('require request => ', request);

        let cachedPath = cachedCalls[request] || '';
        if (AppUtils.not(cachedPath)) {
            const aliasPath = getAliasPath(request);
            console.log('aliasPath => ', aliasPath);

            const fileName = sliceAsterisk(getFilePath(request));
            console.log('fileName => ', fileName);

            if (AppUtils.isTrue(aliasPath)) {
                const fileExtension = path.extname(request);
                console.log('fileExtension => ', fileExtension);



                const realPath = sliceAsterisk(aliasPath[0]);
                console.log('realPath => ', realPath);

                const reletivePath = path.join(baseUrl, realPath, fileName);
                console.log('reletivePath => ', reletivePath);

                const pathExist = fs.existsSync(reletivePath);
                console.log('pathExist => ', pathExist);

                if (pathExist) {
                    cachedPath = reletivePath;
                }
                else {
                    const basedIndexRequest = path.join(baseUrl, request, 'index.js')
                    cachedPath = fs.existsSync(basedIndexRequest) ? basedIndexRequest : ''
                }
                cachedCalls[request] = cachedPath
            }
        }
        return originalRequire.call(this, cachedPath || request)
    }
})();



NodeServer.bootstrap()
    .then(() => {
        console.log('Node verions is => ', process.version);
        console.log('Node title is => ', process.title);
    });
