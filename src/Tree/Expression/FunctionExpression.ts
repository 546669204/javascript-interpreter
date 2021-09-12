import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { FunctionExpression as tFunctionExpression } from '@babel/types';
import Expression from ".";
import Statement from "../Statement";
import Cache from "../cache";
import { logger, ProxyFunction } from "@/utils";
import { Signal } from "@/signal";


export default class FunctionExpression extends Tree {
  constructor(ast: tFunctionExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tFunctionExpression;
    // 是否生成器
    // 是否async函数
    return ProxyFunction(ast, context);
  }
}