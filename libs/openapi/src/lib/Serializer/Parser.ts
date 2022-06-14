import * as openapi from 'openapi3-ts';
import { Injector } from 'tiny-injector';
import * as ts from 'typescript';

import { Annotations } from '../Annotations/Annotations';
import { Meta } from './Meta';
import { SerializerUtility } from './SerializerUtility';

export class Parser {
  protected utility = Injector.GetRequiredService(SerializerUtility);

  public ParseGenericParam(
    symbol: ts.Symbol,
    generateType: (typeName: string) => openapi.SchemaObject
  ): openapi.SchemaObject {
    return { type: 'object', properties: {} };
  }

  public ParsePrimitive(propertySymbol: ts.Symbol): openapi.SchemaObject {
    const declarations = propertySymbol.getDeclarations()![0];
    const [objectRefArg] =
      this.utility.GetDecoratorArgs(declarations, Annotations.Schema) ?? [];
    const schema: openapi.SchemaObject = {
      type: this.utility.GetSymbolType(propertySymbol) as any,
    };
    if (!objectRefArg) {
      return schema;
    }

    const {
      Description,
      Title,
      Format,
      Nullable,
      Required,
      ReadOnly,
      WriteOnly,
      Deprecated,
    } = this.utility.ObjectReferenceToObjectLiteral(
      objectRefArg as ts.ObjectLiteralExpression
    );
    return {
      required: this.ParseBoolean(Required, false)
        ? [propertySymbol.name]
        : undefined,
      ...schema,
      nullable: this.ParseBoolean(Nullable, false) || undefined,
      writeOnly: this.ParseBoolean(WriteOnly, false) || undefined,
      readOnly: this.ParseBoolean(ReadOnly, false) || undefined,
      deprecated: this.ParseBoolean(Deprecated, false) || undefined,
      // FIXME: add support for default
      format: Format,
      title: Title,
      description: Description,
    };
  }

  public static ParseBoolean(
    argument: ts.Expression | undefined | string,
    defaultValue: boolean
  ): boolean {
    if (typeof argument === 'string') {
      return JSON.parse(argument || `${defaultValue}`);
    }
    return JSON.parse(argument?.getText() || `${defaultValue}`);
  }

  public ParseBoolean(
    argument: ts.Expression | undefined | string,
    defaultValue: boolean
  ) {
    return Parser.ParseBoolean(argument, defaultValue);
  }

  public ParseNumber(value: string): number {
    return parseFloat(value);
  }

  public ParseEnum(meta: Meta<ts.EnumDeclaration>): openapi.SchemaObject {
    const strings: string[] = [];
    const numbers: number[] = [];
    const booleans: string[] = [];
    meta.node.members.forEach((m) => {
      switch (m.initializer?.kind) {
        case ts.SyntaxKind.StringLiteral:
          strings.push(m.initializer.getText());
          break;
        case ts.SyntaxKind.NumericLiteral:
          numbers.push(this.ParseNumber(m.initializer.getText()));
          break;
        case ts.SyntaxKind.FalseKeyword:
        case ts.SyntaxKind.TrueKeyword:
          booleans.push(m.initializer.getText());
          break;
        default:
          throw new Error(`Unkown Enum Type ${m.initializer?.kind}`);
      }
    });
    const anyOf: openapi.SchemaObject['anyOf'] = [];
    if (numbers.length) {
      anyOf.push({
        type: 'number',
        enum: numbers,
      });
    }
    if (strings.length) {
      anyOf.push({
        uniqueItems: true,
        type: 'string',
        enum: strings,
      });
    }
    if (booleans.length) {
      anyOf.push({
        uniqueItems: true,
        type: 'boolean',
        enum: booleans,
      });
    }
    if (anyOf.length > 2) {
      const schema: openapi.SchemaObject = {
        uniqueItems: true,
        type: 'array',
        anyOf,
      };
      return schema;
    }
    const schema: openapi.SchemaObject = {
      uniqueItems: true,
      type: 'array',
      items: anyOf[0],
    };
    return schema;
  }
}

export class CombinedParser extends Parser {
  constructor(
    public map: Map<string, string | { type: string; child: string }>
  ) {
    super();
  }
  public override ParseEnum(
    meta: Meta<ts.EnumDeclaration>
  ): openapi.SchemaObject {
    // TODO if there's mutilple types create anyof schema instead
    const schema = super.ParseEnum(meta);
    if (schema.anyOf) {
      schema.anyOf = schema.anyOf.map((subSchema) => {
        return {
          type: (subSchema as openapi.SchemaObject).type,
          example: (subSchema as openapi.SchemaObject).enum?.[0],
        };
      });
      return schema;
    }
    return {
      type: (schema.items as openapi.SchemaObject).type,
      example: (schema.items as openapi.SchemaObject).enum?.[0],
    };
  }

  public override ParseGenericParam(
    symbol: ts.Symbol,
    generateType: (typeName: string) => openapi.SchemaObject
  ): openapi.SchemaObject {
    const propertyType = this.utility.GetSymbolType(symbol);
    const boundedType = this.map.get(propertyType) ?? propertyType;
    const isObject = Object.getPrototypeOf(boundedType) === Object.prototype;

    if (typeof boundedType === 'object') {
      return {
        type: 'array',
        items: generateType(boundedType.child),
      };
    } else {
      return generateType(boundedType);
    }
  }
}
