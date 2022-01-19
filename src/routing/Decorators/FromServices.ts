import { InjectionToken, Injector, ServiceType } from "tiny-injector";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

export function FromServices(serviceType?: ServiceType<any>): ParameterDecorator;
export function FromServices(injectionToken?: InjectionToken<any>): ParameterDecorator;
export function FromServices(serviceTypeOrInjectionToken?: any): ParameterDecorator {
    return (target: any, propertyKey, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const parameterMetadata = new ParameterMetadata(
            parameterIndex,
            ParameterType.FROM_SERVICES,
            null,
            propertyKey as string,
            target.constructor.name
        );
        parameterMetadata.setExpectedType(serviceTypeOrInjectionToken ?? parametersTypes[parameterIndex]);
        metadata.registerParameter(parameterMetadata);
    };
}
