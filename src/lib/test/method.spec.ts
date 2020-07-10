import {
    METHODS,
    IMetadataDto,
    IMetadata,
    generateMetadataKey,
    Post,
    HttpDelete,
    HttpPut,
    Patch,
    HttpGet,
    define,
    Router,
} from '@lib/restful';
import 'reflect-metadata';

describe('Define route', () => {
    it('should have the same entry', () => {
        const metainfo: IMetadataDto = {
            uri: '/',
            target: { constructor: {} },
            method: METHODS.GET,
            middlewares: [],
            propertyKey: 'test',
        };
        define(metainfo);
        const key = generateMetadataKey(metainfo.method, metainfo.uri);
        const metadata = Reflect.getMetadata(key, metainfo.target.constructor);
        expect(metadata).toEqual({
            handler: undefined,
            method: metainfo.method,
            middlewares: metainfo.middlewares,
            uri: metainfo.uri
        } as IMetadata);
    });

    it('should fail if the reference is different', () => {
        const metainfo = {
            method: METHODS.GET,
            middlewares: [],
            uri: '',
            propertyKey: 'test',
            target: new Object()
        };
        define(metainfo);
        const key = generateMetadataKey(metainfo.method, metainfo.uri);
        const metadata = Reflect.getMetadata(key, new Object());
        expect(metadata).not.toEqual(metainfo);
    });

});

describe('Decoration', () => {
    it('POST', () => {
        const metaDto = generateMeta({ method: METHODS.POST, uri: '/post' });

        const decoration = Post(metaDto.uri);
        decoration(metaDto.target, metaDto.propertyKey, { value: null });

        const key = generateMetadataKey(metaDto.method, metaDto.uri);
        const metadata = Reflect.getMetadata(key, metaDto.target.constructor);

        expect(metadata).toEqual(getMetadata(metaDto));
    });
    it('DELETE', () => {
        const metaDto = generateMeta({ method: METHODS.DELETE, uri: '/delete' });

        const decoration = HttpDelete(metaDto.uri);
        decoration(metaDto.target, metaDto.propertyKey, { value: null });

        const key = generateMetadataKey(metaDto.method, metaDto.uri);
        const metadata = Reflect.getMetadata(key, metaDto.target.constructor);

        expect(metadata).toEqual(getMetadata(metaDto));
    });
    it('PUT', () => {
        const metaDto = generateMeta({ method: METHODS.PUT, uri: '/put' });

        const decoration = HttpPut(metaDto.uri);
        decoration(metaDto.target, metaDto.propertyKey, { value: null });

        const key = generateMetadataKey(metaDto.method, metaDto.uri);
        const metadata = Reflect.getMetadata(key, metaDto.target.constructor);

        expect(metadata).toEqual(getMetadata(metaDto));
    });
    it('PATCH', () => {
        const metaDto = generateMeta({ method: METHODS.PATCH, uri: '/patch' });

        const decoration = Patch(metaDto.uri);
        decoration(metaDto.target, metaDto.propertyKey, { value: null });

        const key = generateMetadataKey(metaDto.method, metaDto.uri);
        const metadata = Reflect.getMetadata(key, metaDto.target.constructor);

        expect(metadata).toEqual(getMetadata(metaDto));
    });
    it('GET', () => {
        const metaDto = generateMeta({ method: METHODS.GET, uri: '/get' });

        const decoration = HttpGet(metaDto.uri);
        decoration(metaDto.target, metaDto.propertyKey, { value: null });

        const key = generateMetadataKey(metaDto.method, metaDto.uri);
        const metadata = Reflect.getMetadata(key, metaDto.target.constructor);

        expect(metadata).toEqual(getMetadata(metaDto));
    });
});

describe('Router Decorator', () => {
    it('Test', () => {
        const router = Router('router');
        router(class {

        });
        expect(true).toBeTruthy();
    });
});

function getMetadata({ method, middlewares, uri }: IMetadataDto): IMetadata {
    return {
        handler: undefined,
        method,
        middlewares,
        uri
    };
}
function generateMeta({ method, uri }: Partial<IMetadataDto>): IMetadataDto {
    return {
        uri,
        method,
        target: { constructor: {} },
        middlewares: [],
        propertyKey: 'testOperation'
    };
}

// STUB TEST interceptor
// STUB Add more test cases to http method decorators
