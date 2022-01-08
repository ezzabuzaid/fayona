import { Injector } from "@lib/dependency-injection";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";


export function ContextResponse(): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.RESPONSE,
                null,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
