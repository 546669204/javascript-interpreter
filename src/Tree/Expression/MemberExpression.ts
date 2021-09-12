import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { MemberExpression as tMemberExpression } from '@babel/types';
import Expression from ".";
import Cache from "../cache"
import { Var } from "../../context/Environment";
import { logger } from "@/utils";
import { getGlobalValue, getWindow } from "@/context/globalObject";

export default class MemberExpression extends Tree {
  opts: {
    parent?: string
  };
  constructor(ast: tMemberExpression, opts: Object) {
    super(ast);
    this.opts = opts;
  }
  evaluate(context: Context) {
    let ast = this.ast as tMemberExpression
    let object = new Expression(ast.object).evaluate(context);
    if (ast.property.type == "PrivateName") {
      throw "不支持PrivateName"
    }
    // 是否动态获取
    let computed = ast.computed;
    let property = new Expression(ast.property, { parent: computed?undefined:"MemberExpression" }).evaluate(context);

    logger.debug("MemberExpression", object, property, context.code.substring(ast.start || 0, ast.end || 0))
    if(object == undefined){
      throw new (getGlobalValue("TypeError"))(`${context.code.get(ast.object)} is undefined`)
    }
    // 判断是否是 调用对象函数 修复this
    if (this.opts.parent == "CallExpression") {
      const fn = object[property]
      if (!fn || typeof fn != "function") {
        return undefined;
      }
      if(property == "call" || property == "apply"){
        context.callProperty = property;
        return object;
      }
      if(property == "getPrototypeOf"){
        return fn;
      }
      if(object == getWindow() ){
        return fn;
      }
      return fn.bind(object)
    }
    return object[property];
  }
}