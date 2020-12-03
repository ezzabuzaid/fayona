import { locate } from 'locator';
import { FromHeaders } from 'restful/headers_decorator';
import { TokenHelper } from './token_helper';

export function Token() {
    return FromHeaders((headers: { [key: string]: any }) => locate(TokenHelper).decodeToken(headers['authorization']));
}
