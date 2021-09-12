import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { SwitchStatement as tSwitchStatement } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { getLabel, logger } from "@/utils";
import { Signal } from "@/signal";

export default class SwitchStatement extends Tree {
  constructor(ast: tSwitchStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tSwitchStatement;
    let discriminant = new Expression(ast.discriminant).evaluate(context);
    let defaultStat ;
    let m = -1;
    
    let caseLen = ast.cases.length;
    for (let i = 0; i < caseLen; i++) {
      const caseNode = ast.cases[i];
      if(caseNode.test == null){
        defaultStat = i;
        continue;
      }
      if(new Expression(caseNode.test).evaluate(context) === discriminant){
        m = i;
        break;
      }
    }
    if(m == -1 && defaultStat != undefined){
      m = defaultStat;
    }
    if(m == -1){
      return ;
    }
    let V;
    for (let i = m; i < caseLen; i++) {
      const caseNode = ast.cases[i];
      for (const consequent of caseNode.consequent) {
        const s = new Statement(consequent).evaluate(context);
        if (s instanceof Signal) {
          if (s.value != undefined) {
            V = s.value
          }
          if (s.type != "continue" || s.target != getLabel(ast)) {
            if (s.type == "break" && s.target == getLabel(ast)) {
              return V;
            }
            if (s.type != "normal") {
              return s;
            }
          }
        } else if (s != undefined) {
          V = s;
        }
      }
    }

    return V;
  }
}