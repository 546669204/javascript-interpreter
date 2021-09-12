import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { NewExpression as tNewExpression } from '@babel/types';
import Expression from ".";
import Cache from "../cache"
import { logger } from "@/utils";
import { getGlobalValue } from "@/context/globalObject";

export default class NewExpression extends Tree {
  constructor(ast: tNewExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tNewExpression
    var Class = new Expression(ast.callee).evaluate(context);
    let args = ast.arguments.map(node => {
      if (node.type == "JSXNamespacedName") {
        throw "不支持JSXNamespacedName"
      }
      if (node.type == "SpreadElement") {
        throw "不支持SpreadElement"
      }
      if (node.type == "ArgumentPlaceholder") {
        throw "不支持ArgumentPlaceholder"
      }
      return new Expression(node).evaluate(context);
    })
    logger.debug(
      "NewExpression",
      Class,
      args
    )
    function _construct(Parent: any, args:any[], Class?:any) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = getGlobalValue("Function").bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) Object.setPrototypeOf(instance, Class.prototype);
      return instance;
    };
    return _construct.apply(null, [Class, args]);

  }
}