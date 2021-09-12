import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ContinueStatement as tContinueStatement,Node as tNode } from '@babel/types';
import { Signal } from "@/signal";

export default class ContinueStatement extends Tree {
  constructor(ast: tNode) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tContinueStatement;
    return new Signal({
      type:"continue",
      target:ast.label?.name
    });
  }
}