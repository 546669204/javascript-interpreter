import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { LogicalExpression as tLogicalExpression } from '@babel/types';
import Expression from ".";
import { logger } from "@/utils";

const opts = {
  // 当时运算符时 left 为 false 会执行 right
  "||": function (left: any, right: any) {
    return left || right
  },
  // 当时运算符时 left 为true 会执行 right
  "&&": function (left: any, right: any) {
    return left && right
  },
  "??": function (left: any, right: any) {
    return left ?? right
  },
}

export default class LogicalExpression extends Tree {
  constructor(ast: tLogicalExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tLogicalExpression
    let operator = ast.operator;
    let left = new Expression(ast.left).evaluate(context);

    if(operator == "&&" && !left){
      return left;
    }
    if(operator == "||" && left){
      return left;
    }
    let right = new Expression(ast.right).evaluate(context);
    logger.debug("LogicalExpression", left, operator, right,context.code.get(ast))
    return opts[operator](left, right)
  }
}