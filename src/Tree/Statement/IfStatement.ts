import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { IfStatement as tIfStatement } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { logger } from "@/utils";

export default class IfStatement extends Tree {
  constructor(ast: tIfStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tIfStatement;
    let test = new Expression(ast.test).evaluate(context);
    // logger.debug("IfStatement",test)
    if(test){
      return new Statement(ast.consequent).evaluate(context);
    }else{
      return ast.alternate && new Statement(ast.alternate).evaluate(context);
    }
  }
}