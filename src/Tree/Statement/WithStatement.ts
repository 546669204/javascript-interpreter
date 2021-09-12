import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { WithStatement as tWithStatement,Node as tNode } from '@babel/types';
import Expression from "../Expression";
import Cache from "../cache"
import Statement from ".";
import { logger } from "@/utils";
import { getGlobalValue } from "@/context/globalObject";

export default class WithStatement extends Tree {
  constructor(ast: tNode) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tWithStatement;
    let object = new Expression(ast.object).evaluate(context);
    const env = context.env.children();
    if(object == undefined || object == null){
      throw new (getGlobalValue("TypeError"))("Cannot convert undefined or null to object")
    }
    if(typeof object != "object" && typeof object != "function"){
      object = {};
    }
    Object.defineProperty(object,"___keys___",{
      value:Object.keys(object),
      writable:false,
      enumerable:false,
      configurable:true
    })
    env.withObject = object;
    Object.keys(object).forEach(key=>{
      env.def(key).set(object[key]);
      env.vars[key].update = false;
    })
    try {
      return new Statement(ast.body).evaluate(context.clone({...context,env}));
    } catch (error) {
      throw error;
    }finally{
      logger.debug("WithStatement",object,env.vars)
      env.updateWith()
    }
    
  }
}