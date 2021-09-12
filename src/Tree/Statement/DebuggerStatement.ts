import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { DebuggerStatement as tDebuggerStatement, Node as tNode } from '@babel/types';
import Expression from "../Expression";
import Cache from "../cache"
import { Signal } from "@/signal";
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/break

export default class DebuggerStatement extends Tree {
  constructor(ast: tNode) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tDebuggerStatement;
    debugger;
  }
}