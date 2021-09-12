import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { TryStatement as tTryStatement,Node as tNode } from '@babel/types';
import Expression from "../Expression";
import Cache from "../cache"
import Statement from ".";
import { logger } from "@/utils";
import { Signal } from "@/signal";
import { getGlobalValue } from "@/context/globalObject";

export default class TryStatement extends Tree {
  constructor(ast: tNode) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tTryStatement;
    try {
      const s = new Statement(ast.block).evaluate(context)
      if(s instanceof Signal){
        if(s.type != "normal"){
          return s;
        }
      }
    } catch (error:any) {
      logger.debug("TryStatement",error)
      if(error.name && ["Error","EvalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"].includes(error.name)){
        error.__proto__ = getGlobalValue(error.name).prototype;
      }
      
      
      if(ast.handler){
        const env = context.env.children();
        if(ast.handler.param){
          if(ast.handler.param.type != "Identifier"){
            throw "TryStatement 不支持的 "+ ast.handler.param.type
          }
          const errorName = ast.handler.param.name;
          env.def(errorName).set(error);
          env.vars[errorName].kind = "error";
        }
        const s = new Statement(ast.handler.body).evaluate(context.clone({...context,env}))
        if(s instanceof Signal){
          if(s.type != "normal"){
            return s;
          }
        }
      }
    } finally {
      if(ast.finalizer){
        const s = new Statement(ast.finalizer).evaluate(context)
        if(s instanceof Signal){
          if(s.type != "normal"){
            return s;
          }
        }
      }
    }
  }
}