import Tree from "@/Tree/Tree"
import Context from "@/context"
import type { Literal as tLiteral } from '@babel/types';
import { logger } from "@/utils";

export default class Literal extends Tree {
  constructor(ast: tLiteral) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast;
    if (ast.type == "StringLiteral" || ast.type == "NumericLiteral" || ast.type == "BooleanLiteral") {
      return ast.value
    }
    if(ast.type == "NullLiteral"){
      return null;
    }
    if(ast.type == "RegExpLiteral"){
      return new RegExp(ast.pattern,ast.flags);
    }
    logger.debug("Literal",ast);
    throw "未知Literal"
  }
}