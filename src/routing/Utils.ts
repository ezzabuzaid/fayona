export const makeHandlerName = (target: Function, methodName: string) => {
    return target.name + methodName;
}
