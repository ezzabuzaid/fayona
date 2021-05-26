import { ParameterMetadata, ParameterType, registerParameter } from './index';


// FIXME: create another override that takes only options
export function FromQuery(queryParamName?: string, options?: { queryPolluted: boolean }): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const metadata = new ParameterMetadata(
            parameterIndex,
            ParameterType.QUERY,
            queryParamName,
            propertyKey,
            target.constructor.name,
            options
        );
        metadata.setExpectedType(parametersTypes[parameterIndex]);
        registerParameter(metadata);
    };
}
