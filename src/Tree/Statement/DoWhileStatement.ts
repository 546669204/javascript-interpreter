import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { DoWhileStatement as tDoWhileStatement } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { forTimeOut, getLabel, logger } from "@/utils";
import { Signal } from "@/signal";

export default class DoWhileStatement extends Tree {
  constructor(ast: tDoWhileStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tDoWhileStatement;
    var timeout = forTimeOut();
    if (ast.test && ast.test.type == "FunctionExpression") {
      ast.test.id?.name && context.env.def(ast.test.id?.name);
    }
    let V = undefined;
    do {
      V = undefined;
      timeout.check();
      const s = new Statement(ast.body).evaluate(context);
      logger.debug("DoWhileStatement", context.code.get(ast.body), context.code.get(ast.test), s)
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

    } while (ast.test ? new Expression(ast.test).evaluate(context) : undefined)
    return V;
  }
}