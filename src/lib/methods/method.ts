import { ErrorHandling } from '@core/helpers';
import path = require('path');
import { RequestHandler } from 'express';

export function method(method, target, uri: string, middlewares: RequestHandler[], propertyKey: string) {
    target[method](path.normalize(path.join('/', uri)), ErrorHandling.wrapRoute(...middlewares, function () {
        return target[propertyKey](...arguments);
    }));
}
