import Tree from "@/Tree/Tree"
import Context from "@/context"
import type { Identifier as tIdentifier } from '@babel/types';
import { logger } from "@/utils";
import { getWindow } from "@/context/globalObject";

export default class Identifier extends Tree {
  opts: any;
  constructor(ast: tIdentifier,options:Object) {
    super(ast);
    this.opts = options
  }
  evaluate(context: Context) {
    let ast = this.ast as tIdentifier
    if(this.opts.parent == "MemberExpression"){
      return ast.name
    }
    if(ast.name == "undefined"){
      return undefined
    }
    if(ast.name == "NaN"){
      try {
        return context.env.get(ast.name)
      } catch (error) {
        return NaN
      }
    }
    if(ast.name == "Infinity"){
      try {
        return context.env.get(ast.name)
      } catch (error) {
        return Infinity
      }
    }
    if(ast.name == "window" || ast.name == "globalThis"){
      return getWindow()
    }
    try {
      logger.debug("Identifier",context.env,ast.name,context.env.get(ast.name,true))
    } catch (error) {
      logger.debug("Identifier",context.env,ast.name)
      throw error;
    }
    if(this.opts.parent == "UpdateExpression"){
      return context.env.get(ast.name,true)
    }
    return context.env.get(ast.name)
  }
}