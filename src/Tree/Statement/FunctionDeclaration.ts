import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { FunctionDeclaration as tFunctionDeclaration } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { Signal } from "@/signal";
import { logger, ProxyFunction } from "@/utils";
import globalObject from "@/context/globalObject";

export default class FunctionDeclaration extends Tree {
  opts: any;
  constructor(ast: tFunctionDeclaration,opts:any) {
    super(ast);
    this.opts = opts;
  }
  evaluate(context: Context) {
    let ast = this.ast as tFunctionDeclaration;
    if (!ast.id) {
      throw "不支持的 匿名函数"
    }
    if(this.opts.hoisting){
      const env = context.env.getFunctionEnvironment()
      env.def(ast.id.name).set(ProxyFunction(ast, context));
      env.vars[ast.id.name].kind = "function"
      logger.debug("FunctionDeclaration",ast.id.name,env.vars[ast.id.name].value)
    }
  }
}