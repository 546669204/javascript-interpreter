import Tree from "@/Tree/Tree"
import Context from "../../context"
import { isExpression } from '@babel/types';
import type { ObjectExpression as tObjectExpression, FunctionExpression as tFunctionExpression } from '@babel/types';
import Expression from ".";
import Statement from "../Statement";
import Cache from "../cache";
import FunctionExpression from "./FunctionExpression";
import { logger } from "@/utils";
import { getGlobalValue } from "@/context/globalObject";


export default class ObjectExpression extends Tree {
  constructor(ast: tObjectExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tObjectExpression;
    if (!ast.properties || ast.properties.length <= 0) return getGlobalValue("Object")();
    logger.debug("ObjectExpression start", ast.properties);
    const getOrSet: { [key: string]: any } = {};
    const r = ast.properties.reduce((acc: { [key: string]: any }, node) => {
      if (node.type == "SpreadElement") {
        throw "不支持 SpreadElement"
      }
      let computed = node.computed; // 动态key
      // let shorthand = node.shorthand; // 短的声明 例如 {a}
      let key = "";
      if (isExpression(node.key) && computed) {
        key = new Expression(node.key).evaluate(context) as string;
      } else {
        if (node.key.type == "Identifier") {
          key = node.key.name
        }
        if (node.key.type == "StringLiteral" || node.key.type == "NumericLiteral") {
          key = node.key.value + "";
        }
      }
      logger.debug("ObjectExpression", key, node)
      if (node.type == "ObjectMethod") {
        const fn = new FunctionExpression(<tFunctionExpression><unknown>node).evaluate(context)
        if (node.kind == "method") {
          acc[key] = fn;
        }
        if (node.kind == "get" || node.kind == "set") {
          if (!getOrSet[key]) {
            getOrSet[key] = {};
          }
          getOrSet[key][node.kind] = fn;
        }
        return acc;
      }
      let value = new Expression(node.value).evaluate(context);
      acc[key] = value
      return acc;
    }, {});
    if(Object.keys(getOrSet).length){
      Object.keys(getOrSet).forEach(it=>{
        Object.defineProperty(r,it,{
          ...getOrSet[it],
          configurable:true,
          enumerable:true
        })
      })
    }
    r.__proto__ = getGlobalValue("Object").prototype;
    return r;
  }
}