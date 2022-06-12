import * as openapi from 'openapi3-ts';
import { join } from 'path';
import { Inject, Injectable, ServiceLifetime } from 'tiny-injector';
import * as ts from 'typescript';

import { Annotations } from '../Annotations/Annotations';
import GlobalEventEmitter from '../GlobalEventEmitter';
import { HttpActions } from '../HttpActions';
import { HttpMethod } from '../HttpMethods';
import { CHECKER_TOKEN, PROGRAM_TOKEN } from '../Tokens';
import { JsonSpec } from './JsonSpec';
import { Parser } from './Parser';
import { SerializerUtility } from './SerializerUtility';

const ActionToHttpVerbMap: Record<HttpActions, HttpMethod> = {
  HttpPut: HttpMethod.PUT,
  HttpPost: HttpMethod.POST,
  HttpGet: HttpMethod.GET,
  HttpDelete: HttpMethod.DELETE,
  HttpPatch: HttpMethod.PATCH,
};
@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
export class Serializer {
  constructor(
    @Inject(CHECKER_TOKEN) private _checker: ts.TypeChecker,
    @Inject(PROGRAM_TOKEN) private _program: ts.Program,
    private jsonSpec: JsonSpec,
    private utility: SerializerUtility
  ) {}

  public _SerializeParameter(
    node: ts.ParameterDeclaration,
    name: 'FromHeader' | 'FromRoute' | 'FromQuery',
    _in: openapi.ParameterObject['in'],
    defaultRequired = false
  ): openapi.ParameterObject {
    const [parameterNameArg] = this.utility.GetDecoratorArgs(node, name)!;
    const [messageArg, requiredArg] =
      this.utility.GetDecoratorArgs(node, Annotations.Parameter) ?? [];
    const obsolete = this.utility.GetDecoratorArgs(node, Annotations.Obsolete);
    const symbol = this._checker.getSymbolAtLocation(node.name);
    if (!symbol) {
      throw new Error(`Cannot find symbol for ${node.name.getText()}`);
    }

    return {
      in: _in,
      deprecated: !!obsolete,
      required: Parser.ParseBoolean(requiredArg, defaultRequired),
      description: (messageArg as ts.StringLiteral)?.text,
      name: (parameterNameArg as ts.StringLiteral)?.text,
      schema: this.jsonSpec.GenerateSchemaFromSymbol(symbol),
    };
  }

  private _SerializeParameters(nodes: ts.NodeArray<ts.ParameterDeclaration>) {
    return nodes.reduce((acc, paramNode) => {
      if (this.utility.GetDecorator(paramNode, 'FromRoute')) {
        acc.push(
          this._SerializeParameter(paramNode, 'FromRoute', 'path', true)
        );
      }
      if (this.utility.GetDecorator(paramNode, 'FromQuery')) {
        acc.push(
          this._SerializeParameter(paramNode, 'FromQuery', 'query', false)
        );
      }
      if (this.utility.GetDecorator(paramNode, 'FromHeader')) {
        acc.push(
          this._SerializeParameter(paramNode, 'FromHeader', 'header', false)
        );
      }
      return acc;
    }, [] as openapi.ParameterObject[]);
  }

  private _SerializeOperation(node: ts.MethodDeclaration) {
    const [objectRefArg] =
      this.utility.GetDecoratorArgs(node, Annotations.Operation) ?? [];
    if (!objectRefArg) {
      return {};
    }

    const { Summary, Description, OperationId, Tags } =
      this.utility.ObjectReferenceToObjectLiteral(
        objectRefArg as ts.ObjectLiteralExpression
      );
    return {
      description: Description,
      summary: Summary,
      tags: Tags,
      operationId: OperationId,
    };
  }

  private _SerializeFromBody(node: ts.MethodDeclaration) {
    const fromBodyParameter = node.parameters.find((parameter) =>
      this.utility.GetDecorator(parameter, 'FromBody')
    );

    if (!fromBodyParameter) {
      return;
    }

    const [descriptionArg, requiredArg] =
      this.utility.GetDecoratorArgs(
        fromBodyParameter,
        Annotations.RequestBody
      ) ?? [];
    return {
      schema: this._TypeReferenceToSchema(fromBodyParameter.type!),
      required: Parser.ParseBoolean(requiredArg, true),
      description: (descriptionArg as ts.StringLiteral)?.text,
    };
  }

  public SerializeAction(
    node: ts.MethodDeclaration,
    routeName: string,
    routePath: string
  ): openapi.PathsObject | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const actionDecorator = (node.decorators ?? []).find((dec) =>
      this.utility.IsActionDecorator(dec)
    );
    if (!actionDecorator) {
      return;
    }
    const [pathArg] =
      (actionDecorator.expression as ts.CallExpression).arguments ?? [];

    const actionPath = (pathArg as ts.StringLiteral).text;

    const obsolete = this.utility.GetDecoratorArgs(node, Annotations.Obsolete);
    const method =
      ActionToHttpVerbMap[
        this.utility.GetDecoratorName(actionDecorator)! as HttpActions
      ];
    const operationInfo = this._SerializeOperation(node);
    const body = this._SerializeFromBody(node);

    return {
      [join('/', routePath, actionPath)]: {
        [method]: {
          responses: {
            '200': {
              description: 'Response Description test',
              content: {
                'application/json': {
                  schema: this._TypeReferenceToSchema(node.type!),
                },
              },
            } as openapi.ResponseObject,
          },
          requestBody:
            body &&
            ({
              required: body.required,
              description: body.description,
              content: {
                'application/json': {
                  schema: body.schema,
                },
              },
            } as openapi.RequestBodyObject),
          parameters: this._SerializeParameters(node.parameters),
          deprecated: !!obsolete,
          description: operationInfo.description,
          summary: operationInfo.summary,
          operationId: operationInfo.operationId,
          tags: operationInfo.tags ?? [routeName],
        },
      },
    };
  }

  private _TypeReferenceToSchema(
    node: ts.TypeNode,
    ps = {}
  ): openapi.SchemaObject {
    const names = this.utility.GetTypeArgsNames(node) ?? [];
    for (const name of names) {
      const shouldSkipSerializing = ['Promise', 'Array'].includes(name);
      if (shouldSkipSerializing) continue;
      GlobalEventEmitter.emit('schema_added', {
        schema: this.jsonSpec.GenerateSchemaFromTypeName(name),
        name: name,
      });
    }
    return this.jsonSpec.GenerateCombinedSchema(names);
  }
}
