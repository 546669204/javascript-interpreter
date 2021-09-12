import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ReturnStatement as tReturnStatement, Node as tNode } from '@babel/types';
import Expression from "../Expression";
import Cache from "../cache"
import { logger } from "@/utils";
import { Signal } from "@/signal";

export default class ReturnStatement extends Tree {
  constructor(ast: tNode) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tReturnStatement;
    
    if (!ast.argument) {
      logger.debug("ReturnStatement")
      return new Signal({
        type: "return",
      })
    }
    // 分单返回 和 多返回
    var retValue;
    if (ast.argument.type == "SequenceExpression") {
      ast.argument.expressions.forEach(node => {
        retValue = new Expression(node).evaluate(context);
      })
    } else {
      const t =  new Expression(ast.argument).evaluate(context);
      // if(ast.argument.type == "Identifier" && ast.argument.name == "arguments" && t.isArgument){
      //   return new Signal({
      //     type: "return",
      //     value: t[0]
      //   })
      // }
      retValue = t;
    }
    logger.debug("ReturnStatement",retValue)
    return new Signal({
      type: "return",
      value: retValue
    })
  }
}