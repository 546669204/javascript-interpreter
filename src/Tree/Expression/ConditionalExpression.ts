import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { ConditionalExpression as tConditionalExpression } from '@babel/types';
import Expression from ".";
import { logger } from "@/utils";
import Statement from "../Statement";


export default class ConditionalExpression extends Tree {
  constructor(ast: tConditionalExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tConditionalExpression;
    let test = new Expression(ast.test).evaluate(context);
    if(test){
      return new Expression(ast.consequent).evaluate(context);
    }else{
      return ast.alternate && new Expression(ast.alternate).evaluate(context);
    }
  }
}