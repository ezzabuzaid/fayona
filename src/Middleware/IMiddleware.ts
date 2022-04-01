interface HttpContext { }
export interface IMiddleware {
	Invoke(context: HttpContext): Promise<void>;
}
