import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { WhileStatement as tWhileStatement } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { forTimeOut, getLabel, logger } from "@/utils";
import { Signal } from "@/signal";

export default class WhileStatement extends Tree {
  constructor(ast: tWhileStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tWhileStatement;
    var timeout = forTimeOut();
    let V = undefined;
    while(new Expression(ast.test).evaluate(context)){
      V = undefined;
      timeout.check();
      const s = new Statement(ast.body).evaluate(context);
      logger.debug("WhileStatement",s)
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