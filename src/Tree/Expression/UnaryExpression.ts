import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { UnaryExpression as tUnaryExpression } from '@babel/types';
import Expression from ".";
import Cache from "../cache"
import { Var } from "../../context/Environment";
import { logger } from "@/utils";

const ops = {
  "void": function (argument: any, prefix: any) {
    return undefined
  },
  "throw": function (argument: any, prefix: any) {
    throw argument.get();
  },
  "delete": function (argument: any, prefix: any) {
    if (argument && argument.isVar) {
      return argument.delete()
    }
  },
  "!": function (argument: any, prefix: any) {
    if (argument && argument.isVar) {
      return !argument.get()
    }
    return !argument
  },
  "+": function (argument: any, prefix: any) {
    if (argument && argument.isVar) {
      return + argument.get()
    }
    return + argument
  },
  "-": function (argument: any, prefix: any) {
    if (argument && argument.isVar) {
      return - argument.get()
    }
    return - argument
  },
  "~": function (argument: any, prefix: any) {
    if (argument && argument.isVar) {
      return ~ argument.get()
    }
    return ~ argument
  },
  "typeof": function (argument: any, prefix: any) {
    if (argument && argument.isVar) {
      return typeof argument.get()
    }
    return typeof argument
  },
}

export default class UnaryExpression extends Tree {
  constructor(ast: tUnaryExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tUnaryExpression
    let operator = ast.operator;
    let prefix = ast.prefix;
    let argument
    logger.debug("UnaryExpression",ast, context)

    if (operator == "delete") {
      if(ast.argument.type == "Identifier"){
        if(ast.argument.name == "arguments"){
          return false;
        }
        return context.env.delete(ast.argument.name);
      }
      if (ast.argument.type != "MemberExpression") {
        throw `UnaryExpression 不支持 ` + ast.argument.type
      }
      let object = new Expression(ast.argument.object, { parent: "UpdateExpression" }).evaluate(context);

      let property = new Expression(ast.argument.property, { parent: ast.argument.computed ? "" : "MemberExpression" }).evaluate(context);
      if(object.___this_var___){
        return object.___this_var___.delete(property);
      }
      if (object.isVar) {
        object = object.get();
      }
      try {
        return delete object[property];
      } catch (error) {
        // 捕获在严格模式下对只读对象赋值的异常
        if(`${error}`.includes("Cannot assign to read only property")){
          return false
        }
        throw error
      }
    }
    try {
      argument = new Expression(ast.argument, { parent: "UpdateExpression" }).evaluate(context);
    } catch (error) {
      if(String(error).includes("is not defined") && operator == "typeof"){
        return "undefined";
      }
      throw error;
    }
    return ops[operator](argument, prefix)
  }
}