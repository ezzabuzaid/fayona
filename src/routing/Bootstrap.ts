import { Injector } from "@lib/dependency-injection";
import express from "express";
import glob from "fast-glob";
import path from "path";
import { EXPRESS_TOKEN } from "./ExpressToken";
import { Metadata } from "./Metadata";

interface ConfigureOptions {
    controllers: string[];
    /**
     * a string that will be used before each endpoint
     */
    prefix: string;
}

export function isEnv(name: 'development' | 'production' | string) {
    return process.env.NODE_ENV === name;
}

export function bootstrap(options: ConfigureOptions) {
    const application = express();
    const metadata = Injector.GetRequiredService(Metadata);
    /**
     * Register global express application to be able to reference it
     */
    Injector.AddSingleton(EXPRESS_TOKEN, () => application);

    glob.sync(options.controllers, { absolute: true })
        .forEach(filePath => {
            require(filePath);
        });

    metadata.getHttpRoutes()
        .forEach(({ router, endpoint }) => {
            const prefixedEndpoint = path.join(options.prefix ?? '/', endpoint);
            application.use(process.env.SKIP_REGISTERING_ROUTE ? '' : prefixedEndpoint, router);
        });
}
