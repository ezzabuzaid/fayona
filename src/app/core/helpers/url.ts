import { URL } from 'url';

interface UrlInterface {
    port: number;
    host: string;
}

export class Url extends URL {
    constructor(obj: UrlInterface) {
        super('', obj as any);
    }
}