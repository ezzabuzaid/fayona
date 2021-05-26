export abstract class HttpResponse extends Error {
    constructor(
        public statusCode: number
    ) {
        super();
    }

    abstract toJson(): object;

}
