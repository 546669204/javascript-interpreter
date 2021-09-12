import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ThrowStatement as tThrowStatement,Node as tNode } from '@babel/types';
import Expression from "../Expression";
import Cache from "../cache"

export default class ThrowStatement extends Tree {
  constructor(ast: tNode) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tThrowStatement;
    throw new Expression(ast.argument).evaluate(context);
  }
}