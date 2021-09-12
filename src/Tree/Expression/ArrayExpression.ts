import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ArrayExpression as tArrayExpression } from '@babel/types';
import Expression from ".";
import { getGlobalValue } from "@/context/globalObject";


export default class ArrayExpression extends Tree {
  constructor(ast: tArrayExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tArrayExpression;
    if(!ast.elements || ast.elements.length<=0)return getGlobalValue("Array")();
    return getGlobalValue("Array").from(ast.elements.map((node) => {
      if(!node){
        return undefined;
      }
      if (node.type == "SpreadElement") {
        throw "不支持 SpreadElement"
      }
      return new Expression(node).evaluate(context) as string;
    }))
  }
}