
export class Failure extends Error {
    constructor(
        public code: string,
        public message: string
    ) {
        super(message);
    }
}