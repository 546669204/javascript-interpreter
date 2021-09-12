import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ExpressionStatement as tExpressionStatement } from '@babel/types';
import Expression from "../Expression";

export default class ExpressionStatemet extends Tree {
  constructor(ast: tExpressionStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tExpressionStatement;
    return new Expression(ast.expression).evaluate(context);
  }
}