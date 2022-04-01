import express from "express";

export class HttpRouteMetadata {
    constructor(
        public controller: Function,
        public router: ReturnType<typeof express.Router>,
        public endpoint: string,
    ) { }

}
