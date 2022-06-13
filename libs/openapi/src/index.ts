/* eslint-disable @typescript-eslint/no-non-null-assertion */
// TODO: Create before transformers to prevent HTTP actions from having response different than HttpResponse or Promise<HttpResponse>
// TODO: Create before transformer to bind correct HTTP actions paths and Route path from the controller name
// e.g HttpGet() or HttpGet('') will be HttpGet('/')
// e.g Route() or Route('') will be Route('/controller suffix name here')
// This needs to be done prior to runtime so openapi can pick up correct names.
import { writeFileSync } from 'fs';
import * as openapi from 'openapi3-ts';
import { Injector } from 'tiny-injector';
import * as ts from 'typescript';

import GlobalEventEmitter from './lib/GlobalEventEmitter';
import { IOptions } from './lib/IOptions';
import { JsonSpec } from './lib/Serializer/JsonSpec';
import { Serializer } from './lib/Serializer/Serializer';
import { SerializerUtility } from './lib/Serializer/SerializerUtility';
import { CHECKER_TOKEN, OPTIONS_TOKEN, PROGRAM_TOKEN } from './lib/Tokens';

let serializer: Serializer;

export const before = (options: IOptions, program: ts.Program) => {
  GlobalEventEmitter.emit('options', options);
  const checker = program.getTypeChecker();
  Injector.AddSingleton(OPTIONS_TOKEN, () => options);
  Injector.AddSingleton(PROGRAM_TOKEN, () => program);
  Injector.AddSingleton(CHECKER_TOKEN, () => checker);
  serializer = Injector.GetRequiredService(Serializer);
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
            const spec = Injector.GetRequiredService(JsonSpec);
            spec.Initialize(sourceFile);
            const httpActions = SerializeHttpActions(
              node.name!.getText(),
              (routeArgs[0] as ts.StringLiteral).text,
              node.members.filter(ts.isMethodDeclaration)
            );
            GlobalEventEmitter.emit('route_scanned', httpActions);
          }
          return undefined;
        },
        ctx
      );
    };
  };
};

function SerializeHttpActions(
  routeName: string,
  routePath: string,
  nodes: ts.MethodDeclaration[]
): openapi.PathsObject[] {
  const operations: openapi.PathsObject[] = [];
  for (const node of nodes) {
    const serialized = serializer.SerializeAction(node, routeName, routePath);
    if (serialized) {
      operations.push(serialized);
    }
  }
  return operations;
}

let builder: openapi.OpenApiBuilder;
const paths: openapi.PathsObject = {};

GlobalEventEmitter.once('options', (options) => {
  builder = new openapi.OpenApiBuilder({
    paths: paths,
    openapi: '3.0.0',
    security: [{}],
    components: {
      schemas: {},
    },
    info: {
      title: options.name,
      version: options.version,
      description: options?.description,
    },
  });
});

GlobalEventEmitter.on('schema_added', ({ schema, name }) => {
  builder.addSchema(name, schema);
});

GlobalEventEmitter.on('route_scanned', (actions) => {
  actions.forEach((action) => {
    Object.assign(paths, action);
  });
});

process.on('exit', () => {
  writeOpenApi(builder.getSpecAsJson());
});

function writeOpenApi(json: string) {
  const options = Injector.GetRequiredService(OPTIONS_TOKEN);
  writeFileSync(options.fileName ?? 'openapi.json', json, 'utf-8');
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md

export * from './lib/Annotations/ApiParameter';
export * from './lib/Annotations/Obsolete';
export * from './lib/Annotations/Operation';
export * from './lib/Annotations/RequestBody';
export * from './lib/Annotations/Schema';
