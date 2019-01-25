import express = require('express');

const ExpressRouterWithSuper = (() => (express.Router as any) as (new (options: express.RouterOptions) => express.Router))();

// NOTE this used as interface no real
export class ExpressRouter extends (function ExpressRouter() {
    return (express.Router as any) as (new () => express.Router)
}()) { }
