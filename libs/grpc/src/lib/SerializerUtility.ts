import { Inject, Injectable, ServiceLifetime } from 'tiny-injector';
import * as ts from 'typescript';

import { CHECKER_TOKEN, PROGRAM_TOKEN } from './Tokens';

@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
export class SerializerUtility {
  constructor(
    @Inject(CHECKER_TOKEN) private _checker: ts.TypeChecker,
    @Inject(PROGRAM_TOKEN) private _program: ts.Program
  ) {}

  public GetSymbolType(symbol: ts.Symbol) {
    return this._checker.typeToString(
      this._checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    );
  }

  public GetTypeFromSymbol(symbol: ts.Symbol) {
    return this._checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    );
  }

  public GetTypeArgsNames(node: ts.TypeNode): string[] | undefined {
    const collect = (node: ts.TypeReferenceNode): string[] | undefined => {
      if (!node.typeArguments?.length) {
        return [this.GetTypeNodeName(node)];
      }
      return node.typeArguments?.reduce(
        (acc, arg) => {
          return [...acc, ...(collect(arg as ts.TypeReferenceNode) ?? [])];
        },
        [this.GetTypeNodeName(node)] as string[]
      );
    };
    return collect(node as ts.TypeReferenceNode)?.filter((i) => !!i);
  }

  public GetTypeNodeName(node: ts.TypeNode) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      return '';
    }
    return (node as ts.TypeReferenceNode).typeName.getText();
  }

  public GetTypeProperties(type: ts.Type) {
    return this._checker
      .getPropertiesOfType(type)
      .filter((symbol) => !(ts.SymbolFlags.Method & symbol.flags));
  }
  IsActionDecorator(node: ts.Decorator) {
    return [
      'HttpPost',
      'HttpPut',
      'HttpGet',
      'HttpPatch',
      'HttpDelete',
    ].includes(this.GetDecoratorName(node) ?? '');
  }

  GetParameterThatHasDecorator(
    node: ts.MethodDeclaration,
    decoratorName: string
  ) {
    return node.parameters.find((parameter) => {
      return this.GetDecorator(parameter, decoratorName);
    });
  }

  GetDecoratorName(node: ts.Decorator) {
    return ts.isCallExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression)
      ? node.expression.expression.getText()
      : undefined;
  }

  public GetDecoratorArgs<T extends ts.Declaration | ts.Node>(
    node: T,
    name: string
  ): ts.NodeArray<ts.Expression> | undefined {
    const decorator = this.GetDecorator(node, name);
    if (!decorator) {
      return;
    }
    if (ts.isCallExpression(decorator.expression)) {
      return decorator.expression.arguments;
    }
    return;
  }

  public GetDecorator(node: ts.Node, name: string): ts.Decorator {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (ts.getDecorators(node) ?? []).find(
      (item) =>
        ts.isCallExpression(item.expression) &&
        ts.isIdentifier(item.expression.expression) &&
        item.expression.expression.escapedText === name
    );
  }

  public ObjectReferenceToObjectLiteral(node: ts.ObjectLiteralExpression) {
    return (node.properties as ts.NodeArray<ts.PropertyAssignment>).reduce(
      (acc, property) => {
        acc[(property.name as ts.Identifier).text] =
          property.initializer.getText();
        return acc;
      },
      {} as Record<string, string>
    );
  }
}
