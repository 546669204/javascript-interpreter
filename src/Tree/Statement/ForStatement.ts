import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ForStatement as tForStatement } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { forTimeOut, getLabel, logger } from "@/utils";
import { Signal } from "@/signal";

export default class ForStatement extends Tree {
  constructor(ast: tForStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tForStatement;
    var timeout = forTimeOut();
    let V = undefined;
    for (
      ast.init && new Expression(ast.init).evaluate(context);
      ast.test ? new Expression(ast.test).evaluate(context) : true;
      ast.update && new Expression(ast.update).evaluate(context)
    ) {
      V = undefined;
      timeout.check();
      const s = new Statement(ast.body).evaluate(context);
      if (s instanceof Signal) {
        if (s.value != undefined) {
          V = s.value
        }
        // if (s.type != "continue" || s.target != getLabel(ast)) {
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
        // }
      } else if (s != undefined) {
        V = s;
      }
    }
    return V;
  }
}