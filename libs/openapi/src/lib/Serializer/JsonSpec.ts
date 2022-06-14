import * as openapi from 'openapi3-ts';
import { Inject, Injectable, ServiceLifetime } from 'tiny-injector';
import * as ts from 'typescript';

import { CHECKER_TOKEN, PROGRAM_TOKEN } from '../Tokens';
import { Meta } from './Meta';
import { CombinedParser, Parser } from './Parser';
import { SerializerUtility } from './SerializerUtility';

@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
export class JsonSpec {
  userSymbols: {
    [name: string]: Meta;
  } = {};

  generatedTypes: Record<string, openapi.SchemaObject> = {};

  constructor(
    @Inject(CHECKER_TOKEN) private _checker: ts.TypeChecker,
    @Inject(PROGRAM_TOKEN) private _program: ts.Program,
    private utility: SerializerUtility
  ) {}

  private _SerializeSymbol({
    symbol,
    type,
    node,
    parser,
  }: {
    symbol: ts.Symbol;
    type: ts.Type;
    node?: ts.Node;
    parser: Parser;
  }): openapi.SchemaObject {
    if (!symbol.valueDeclaration) {
      throw new Error(
        `Cannot find valueDeclaration for symbol ${symbol.getName()}`
      );
    }
    const properties = this.utility
      .GetTypeProperties(type)
      .reduce((acc, property) => {
        const propertyType = this.utility.GetSymbolType(property);
        if (isPrimitive(propertyType)) {
          acc[property.name] = parser.ParsePrimitive(property);
        } else {
          const isGenericTypeParameter = (
            node as ts.ClassDeclaration
          ).typeParameters?.find((tp) => tp.name.getText() === propertyType);

          if (isGenericTypeParameter) {
            acc[property.name] = parser.ParseGenericParam(
              property,
              this.GenerateSchemaFromTypeName.bind(this)
            );
          } else {
            switch (this.userSymbols[propertyType].node.kind) {
              case ts.SyntaxKind.EnumDeclaration:
                acc[property.name] = parser.ParseEnum(
                  this.GetSymbolByTypeName(propertyType)
                );
                break;
              default:
                acc[property.name] =
                  this.GenerateSchemaFromTypeName(propertyType);
                break;
            }
          }
        }
        return acc;
      }, {} as Record<string, openapi.SchemaObject>);
    return {
      properties,
    };
  }

  /**
   * Serialize complex type
   * @example HttpResponse<ReplaceExampleDto>
   */
  public GenerateCombinedSchema(typeArguments: string[]) {
    typeArguments = typeArguments.filter((item) => {
      return !['Promise'].includes(item);
    });
    const [baseName] = typeArguments.splice(0, 1);
    const meta = this.GetSymbolByTypeName<ts.ClassDeclaration>(baseName);

    const typeParameters =
      meta.node.typeParameters?.map((e) => e.name.getText()) ?? [];

    const map = new Map();
    for (let index = 0; index < typeArguments.length; index++) {
      const element = typeArguments[index];
      if (element === 'Array') {
        const arrayType = typeArguments[index + 1];
        map.set(typeParameters[index], {
          type: 'array',
          host: element,
          child: arrayType,
        });
        index += 1;
      } else {
        map.set(typeParameters[index], element);
      }
    }

    const parser = new CombinedParser(map);
    const schema = this._SerializeSymbol({
      ...this.GetSymbolByTypeName(baseName),
      parser,
    });
    return schema;
  }

  public GenerateSchemaFromSymbol(symbol: ts.Symbol): openapi.SchemaObject {
    const typeName = this.utility.GetSymbolType(symbol);
    const parser = new Parser();
    if (isPrimitive(typeName)) {
      return parser.ParsePrimitive(symbol);
    }
    return this.GenerateSchemaFromTypeName(typeName);
  }
  public GenerateSchemaFromTypeName(name: string) {
    if (this.generatedTypes[name]) {
      return this.generatedTypes[name];
    }
    const parser = new Parser();
    const schema = this._SerializeSymbol({
      ...this.GetSymbolByTypeName(name),
      parser,
    });
    this.generatedTypes[name] = schema;
    return schema;
  }

  public GetSymbolByTypeName<T extends ts.Node>(name: string): Meta<T> {
    if (!this.userSymbols[name]) {
      throw new Error(`No type for ${name}`);
    }
    return this.userSymbols[name] as Meta<T>;
  }

  public Initialize(_sourceFile: ts.SourceFile) {
    const symbols: any[] = [];
    const allSymbols: { [name: string]: ts.Type } = {};

    const inheritingTypes: { [baseName: string]: string[] } = {};

    this._program.getSourceFiles().forEach((sourceFile, _sourceFileIdx) => {
      const inspect = (node: ts.Node) => {
        if (
          node.kind === ts.SyntaxKind.ClassDeclaration ||
          node.kind === ts.SyntaxKind.InterfaceDeclaration ||
          node.kind === ts.SyntaxKind.EnumDeclaration ||
          node.kind === ts.SyntaxKind.TypeAliasDeclaration
        ) {
          const symbol: ts.Symbol = (<any>node).symbol;
          const nodeType = this._checker.getTypeAtLocation(node);
          const fullyQualifiedName =
            this._checker.getFullyQualifiedName(symbol);
          const typeName = fullyQualifiedName.replace(/".*"\./, '');
          const name = typeName;

          symbols.push({ name, typeName, fullyQualifiedName, symbol });
          if (!this.userSymbols[name]) {
            allSymbols[name] = nodeType;
          }

          if (!sourceFile.hasNoDefaultLib) {
            this.userSymbols[name] = { symbol, type: nodeType, node };
          }

          const baseTypes = nodeType.getBaseTypes() || [];

          baseTypes.forEach((baseType) => {
            const baseName = this._checker.typeToString(
              baseType,
              undefined,
              ts.TypeFormatFlags.UseFullyQualifiedType
            );
            if (!inheritingTypes[baseName]) {
              inheritingTypes[baseName] = [];
            }
            inheritingTypes[baseName].push(name);
          });
        } else {
          ts.forEachChild(node, (n) => inspect(n));
        }
      };
      inspect(sourceFile);
    });
  }
}

function isPrimitive(type: string) {
  return ['string', 'number', 'boolean'].includes(type);
}
