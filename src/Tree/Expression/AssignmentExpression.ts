import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { AssignmentExpression as tAssignmentExpression } from '@babel/types';
import Expression from ".";
import globalObject from "@/context/globalObject";
import { logger } from "@/utils";
function getLeftValue(left: any, property: any) {
  if (!property) {
    return left.get();
  } else {
    if (left && left.isVar) {
      left = left.get();
    }
    if (left.___this_var___) {
      return left.___this_var___.get();
    }
    return left
  }
}
const ops = {
  "=": function (left: any, right: any, property: { value: string }) {
    if (!property) {
      left.set(right)
      return right
    } else {
      if (left && left.isVar) {
        left = left.get();
      }
      if (left.___this_var___) {
        return left.___this_var___.def(property.value).set(right), right;
      }
      try {
        return left[property.value] = right;
      } catch (error) {
        // 捕获在严格模式下对只读对象赋值的异常
        if (`${error}`.includes("Cannot assign to read only property")) {
          return right
        }
        if (`${error}`.includes("Cannot set property")) {
          return right
        }
        throw error
      }
    }
  },
  "+=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) + right, property)
  },
  "-=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) - right, property)
  },
  "/=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) / right, property)
  },
  "*=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) * right, property)
  },
  "&=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) & right, property)
  },
  "|=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) | right, property)
  },
  "^=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) ^ right, property)
  },
  "**=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) ** right, property)
  },
  "&&=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) && right, property)
  },
  "||=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) || right, property)
  },
  "??=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) ?? right, property)
  },
  "%=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) % right, property)
  },
  "<<=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) << right, property)
  },
  ">>=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) >> right, property)
  },
  ">>>=": function (left: any, right: any, property: { value: string }) {
    return ops["="](left, getLeftValue(left, property) >>> right, property)
  },
}

export default class AssignmentExpression extends Tree {
  constructor(ast: tAssignmentExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tAssignmentExpression;
    let operator = ast.operator;
    if (ast.left.type != "Identifier" && ast.left.type != "MemberExpression") {
      throw "不支持的 " + ast.left.type
    }
    let right = new Expression(ast.right).evaluate(context);
    let left
    if (ast.left.type == "Identifier") {
      try {
        left = new Expression(ast.left, { parent: "UpdateExpression" }).evaluate(context);
      } catch (error) {
        if(operator == "="){
          // @ts-ignore
          return ops[operator](globalObject.def(ast.left.name), right)
        }
        throw error;
      }
      // @ts-ignore
      return ops[operator](left, right)
    }
    if (ast.left.type == "MemberExpression") {
      let object = new Expression(ast.left.object, { parent: "UpdateExpression" }).evaluate(context);

      let property = new Expression(ast.left.property, { parent: ast.left.computed ? "" : "MemberExpression" }).evaluate(context);
      logger.debug("AssignmentExpression", object, right, JSON.stringify(property))
      // @ts-ignore
      return ops[operator](object, right, { value: property })
    }



  }
}