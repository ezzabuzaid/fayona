
const tsconfig = require('./tsconfig.json');
const path = require('path');
const fs = require('fs');
(function () {
    const sliceAsterisk = (url) => url.split('/*')[0];
    const getFilePath = (url) => {
        const urlParts = url.split('/');
        urlParts.splice(0, 1);
        return urlParts.join('/');
    };
    const getAliasPath = (pathAlias) => paths[pathAlias.split('/')[0]];

    const baseUrl = path.join(process.cwd(), 'dist');
    console.log('baseUrl => ', baseUrl);

    const cachedCalls = {};

    const modulePrototype = Object.getPrototypeOf(module);
    const originalRequire = modulePrototype.require;

    const paths = tsconfig.compilerOptions.paths;
    for (const aliasPath in paths) {
        paths[sliceAsterisk(aliasPath)] = paths[aliasPath];
        delete paths[aliasPath];
    }


    modulePrototype.require = function (request) {
        console.log('require request => ', request);

        let cachedPath = cachedCalls[request] || '';
        if (!cachedPath) {
            const aliasPath = getAliasPath(request);
            console.log('aliasPath => ', aliasPath);

            const fileName = sliceAsterisk(getFilePath(request));
            console.log('fileName => ', fileName);

            if (!!aliasPath) {
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
                } else if (fileExtension !== 'js') {
                    cachedPath = reletivePath + '.js';
                } else {
                    const basedIndexRequest = path.join(baseUrl, request, 'index.js')
                    cachedPath = fs.existsSync(basedIndexRequest) ? basedIndexRequest : ''
                }
                console.log('cachedPath => ', cachedPath);

                cachedCalls[request] = cachedPath
            }
        }
        return originalRequire.call(this, cachedPath || request)
    }
})();

