import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { BinaryExpression as tBinaryExpression } from '@babel/types';
import Expression from ".";
import { Var } from "../../context/Environment";
import { logger } from "@/utils";

const ops = {
  "+": (left: any, right: any) => left + right,
  "-": (left: any, right: any) => left - right,
  "/": (left: any, right: any) => left / right,
  "%": (left: any, right: any) => left % right,
  "*": (left: any, right: any) => left * right,
  "**": (left: any, right: any) => left ** right,
  "&": (left: any, right: any) => left & right,
  "|": (left: any, right: any) => left | right,
  ">>": (left: any, right: any) => left >> right,
  ">>>": (left: any, right: any) => left >>> right,
  "<<": (left: any, right: any) => left << right,
  "^": (left: any, right: any) => left ^ right,
  "==": (left: any, right: any) => left == right,
  "===": (left: any, right: any) => left === right,
  "!=": (left: any, right: any) => left != right,
  "!==": (left: any, right: any) => left !== right,
  "in": (left: any, right: any) => left in right,
  "instanceof": (left: any, right: any) => left instanceof right,
  ">": (left: any, right: any) => left > right,
  "<": (left: any, right: any) => left < right,
  ">=": (left: any, right: any) => left >= right,
  "<=": (left: any, right: any) => left <= right,
}


export default class BinaryExpression extends Tree {
  constructor(ast: tBinaryExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tBinaryExpression
    if (ast.left.type == "PrivateName") {
      throw "不支持PrivateName"
    }
    let left;
    let right;
    let s
    try {
      left = new Expression(ast.left).evaluate(context);
      right = new Expression(ast.right).evaluate(context);
      s = ops[ast.operator](left, right)
    } finally {
      logger.debug("BinaryExpression", left, ast.operator, right, s);
    }
    return s;
  }
}