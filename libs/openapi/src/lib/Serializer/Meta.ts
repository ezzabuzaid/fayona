import * as ts from 'typescript';

export interface Meta<TNode = ts.Node> {
  symbol: ts.Symbol;
  type: ts.Type;
  node: TNode;
}
