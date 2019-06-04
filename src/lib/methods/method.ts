import { RequestHandler } from 'express';

export function method(httpMethod: string, uri: string, middlewares: RequestHandler[], target, propertyKey: string) {
    // target[method](path.normalize(path.join('/', uri)), ErrorHandling.wrapRoute(...middlewares, function() {
    //     return target[propertyKey](...arguments);
    // }));
    return {
        config: { middlewares, uri },
        httpMethod,
        instanceMethod: target[propertyKey]
    };
}
