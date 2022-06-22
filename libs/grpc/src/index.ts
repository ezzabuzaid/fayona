/* eslint-disable @typescript-eslint/no-non-null-assertion */
// TODO: Create before transformers to prevent HTTP actions from having response different than HttpResponse or Promise<HttpResponse>
// TODO: Create before transformer to bind correct HTTP actions paths and Route path from the controller name
// e.g HttpGet() or HttpGet('') will be HttpGet('/')
// e.g Route() or Route('') will be Route('/controller suffix name here')
// This needs to be done prior to runtime so openapi can pick up correct names.
import { writeFileSync } from 'fs';
import { Injectable, Injector, ServiceLifetime } from 'tiny-injector';
import * as ts from 'typescript';

import GlobalEventEmitter from './lib/GlobalEventEmitter';
import { IOptions } from './lib/IOptions';
import { SerializerUtility } from './lib/SerializerUtility';
import { CHECKER_TOKEN, PROGRAM_TOKEN } from './lib/Tokens';

export const before = (options: IOptions | undefined, program: ts.Program) => {
  const checker = program.getTypeChecker();
  // Injector.AddSingleton(OPTIONS_TOKEN, () => options);
  Injector.AddSingleton(PROGRAM_TOKEN, () => program);
  Injector.AddSingleton(CHECKER_TOKEN, () => checker);
  const utility = Injector.GetRequiredService(SerializerUtility);

  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      return ts.visitEachChild(
        sourceFile,
        (node) => {
          if (
            !ts.isClassDeclaration(node) ||
            !utility.GetDecorator(node, 'Route')
          )
            return;
          const routeArgs = utility.GetDecoratorArgs(node, 'Route');
          // Support routes that have explict path for now
          if (routeArgs) {
            const routeName = (
              utility.GetDecoratorArgs(node, 'Route')?.[0] as ts.StringLiteral
            ).text;
            const protoString = Injector.GetRequiredService(
              Serializer
            ).Serialize(routeName, node);
            GlobalEventEmitter.emit('route_scanned', routeName, protoString);
          }
          return undefined;
        },
        ctx
      );
    };
  };
};

@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
class Serializer {
  constructor(private _utility: SerializerUtility) {
    //
  }

  Serialize(name: string, classDeclaration: ts.ClassDeclaration) {
    const rpcs = classDeclaration.members.reduce((acc, node) => {
      if (ts.isMethodDeclaration(node)) {
        acc += this._SerializeAction(node);
      }
      return acc;
    }, '');

    return `service ${name} {
      ${rpcs}
    }`;
  }
  private _SerializeAction(node: ts.MethodDeclaration) {
    const actionName = node.name.getText();
    const request =
      this._utility
        .GetParameterThatHasDecorator(node, 'FromBody')
        ?.name.getText() ?? 'google.protobuf.Empty';
    const response =
      (node.type as ts.TypeReferenceNode).typeName.getText() ??
      'google.protobuf.Empty';
    return this._CreateRPC(actionName, request, response);
  }

  private _CreateRPC(name: string, request: string, response: string) {
    return `rpc ${name} (${request}) returns (${response}) {}`;
  }
  private _ParseType() {
    // FIXME: parse request and response to messages
  }
}

GlobalEventEmitter.on('route_scanned', (name, defs) => {
  writeFileSync(`${name}.proto`, defs, 'utf-8');
});

// process.on('exit', () => {
// });
