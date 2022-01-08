import { locate } from '../locator';
import { FromHeaders } from '../Routing/headers_decorator';
import { TokenHelper } from './TokenHelper';

export function Token() {
    return FromHeaders((headers: { [key: string]: any }) => locate(TokenHelper).decodeToken(headers['authorization']));
}
