import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ThisExpression as tThisExpression } from '@babel/types';
import Expression from ".";
import Cache from "../cache"
import globalObject, { getWindow } from "@/context/globalObject";

// 数是否在new中调用(new绑定)?如果是的话this绑定的是新创建的对象。
// 数是否通过call、apply(显式绑定)或者硬绑定调用?如果是的话,this绑定的是 指定的对象。
// 数是否在某个上下文对象中调用(隐式绑定)?如果是的话,this绑定的是那个上下文对象。
// 果都不是的话,使用默认绑定。如果在严格模式下,就绑定到undefined,否则绑定到 全局对象。

export default class ThisExpression extends Tree {
  constructor(ast: tThisExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tThisExpression
    if (context.this != undefined) {
      return context.this;
    }
    if (context.useStrict) {
      return undefined;
    }
    return getWindow()
  }
}