import { ContextRequest } from "../Routing";
import { Claims } from "./TokenHelper";

export function Token() {
    return ContextRequest(request => request.inject(Claims));
}
