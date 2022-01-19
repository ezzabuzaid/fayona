import express from "express";
import { InjectionToken } from "tiny-injector";

export const CONFIGURE_OPTIONS = new InjectionToken<ConfigureOptions>('CONFIGURE_OPTIONS');
export interface ConfigureOptions {
    controllers: string[];
    apiAdaptar: ReturnType<typeof express>;
}
