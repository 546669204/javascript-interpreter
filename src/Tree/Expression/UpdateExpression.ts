import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { UpdateExpression as tUpdateExpression } from '@babel/types';
import Expression from ".";
import { logger } from "@/utils";

const ops = {
  "++": function (value: any, property: any, prefix: boolean): any {
    if (!property) {
      let v = +value.get();
      value.set(v + 1);
      return prefix ? v + 1 : v;
    } else {
      if (value && value.isVar) {
        value = value.get();
      }
      if (value.___this_var___) {
        return ops["++"](value.___this_var___.get(property.value, true), undefined, prefix)
      }
      if (prefix) {
        return ++value[property.value]
      } else {
        return value[property.value]++
      }
    }
  },
  "--": function (value: any, property: any, prefix: boolean): any {
    if (!property) {
      let v = +value.get();
      value.set(v - 1);
      return prefix ? v - 1 : v;
    } else {
      if (value && value.isVar) {
        value = value.get();
      }
      if (value.___this_var___) {
        return ops["--"](value.___this_var___.get(property.value, true), undefined, prefix)
      }
      if (prefix) {
        return --value[property.value]
      } else {
        return value[property.value]--
      }
    }
  },
}
// 先取值 再赋值
export default class UpdateExpression extends Tree {
  constructor(ast: tUpdateExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tUpdateExpression
    let operator = ast.operator;
    let prefix = ast.prefix;
    let argument;
    let property;
    let V = undefined;
    if (ast.argument.type == "Identifier") {
      argument = new Expression(ast.argument, { parent: "UpdateExpression" }).evaluate(context);
      V = ops[operator](argument, undefined, prefix)
    }
    if (ast.argument.type == "MemberExpression") {
      argument = new Expression(ast.argument.object, { parent: "UpdateExpression" }).evaluate(context);

      property = new Expression(ast.argument.property, { parent: ast.argument.computed ? "" : "MemberExpression" }).evaluate(context);
      V = ops[operator](argument, { value: property }, prefix)
    }
    logger.debug("UpdateExpression", argument, property, prefix, V)
    return V
  }
}