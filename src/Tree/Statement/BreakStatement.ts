import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { BreakStatement as tBreakStatement, Node as tNode } from '@babel/types';
import Expression from "../Expression";
import Cache from "../cache"
import { Signal } from "@/signal";
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/break

export default class BreakStatement extends Tree {
  constructor(ast: tNode) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tBreakStatement;
    return new Signal({
      type: "break",
      target: ast.label?.name
    });
  }
}