import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { SequenceExpression as tSequenceExpression } from '@babel/types';
import Expression from ".";
import Cache from "../cache"

export default class SequenceExpression extends Tree {
  constructor(ast: tSequenceExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tSequenceExpression;
    var lastReturn;
    for (const node of ast.expressions) {
      lastReturn = new Expression(node).evaluate(context);
    }
    return lastReturn;
  }
}