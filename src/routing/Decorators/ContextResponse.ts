import { Injector } from "tiny-injector";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";


export function ContextResponse(): ParameterDecorator {
    return (target: any, propertyKey, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.RESPONSE,
                null,
                propertyKey as string,
                target.constructor.name
            )
        );
    };
}
