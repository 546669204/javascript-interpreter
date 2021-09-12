import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ForInStatement as tForInStatement } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { Signal } from "@/signal";
import { getLabel, logger } from "@/utils";

export default class ForInStatement extends Tree {
  constructor(ast: tForInStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tForInStatement;
    // 初始化 left
    if(ast.left.type == "VariableDeclaration"){
      new Expression(ast.left).evaluate(context);
    }
    let leftName = "";
    if (ast.left.type == "VariableDeclaration") {
      if (ast.left.declarations[0].id.type != "Identifier") {
        throw "ForInStatement 不支持 " + ast.left.declarations[0].id.type
      }
      leftName = ast.left.declarations[0].id.name;
    } else if (ast.left.type == "Identifier") {
      leftName = ast.left.name;
    } else {
      throw "ForInStatement 不支持 " + ast.left.type
    }

    let right = new Expression(ast.right).evaluate(context);
    if(right == null || right == undefined){
      return;
    }
    let V = undefined;
    for (const left in right) {
      V = undefined;
      if(context.env.getOrDefault(leftName)){
        context.env.getOrDefault(leftName).set(left)
      }else{
        context.env.getFunctionEnvironment().def(leftName).set(left);
      }
      const s = new Statement(ast.body).evaluate(context);
      if (s instanceof Signal) {
        if (s.value != undefined) {
          V = s.value
        }
        if (s.type != "continue" || s.target != getLabel(ast)) {
          if (s.type == "break" && s.target == getLabel(ast)) {
            return V;
          }
          if (s.type == "break" && !s.target) {
            return V;
          }
          if (s.type == "continue" && s.target == getLabel(ast)) {
            continue
          }
          if (s.type == "continue" && !s.target) {
            continue
          }
          if (s.type != "normal") {
            return s;
          }
        }
      } else if (s != undefined) {
        V = s;
      }
    }
    return V;
  }
}