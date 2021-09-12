import Tree from "@/Tree/Tree"
import Context from "@/context"
import {isExpression,isStatement} from '@babel/types';
import type {Program as tProgram,Node as tNode,BlockStatement as tBlockStatement} from '@babel/types';
import ExpressionStatemet from "./Statement/ExpressionStatement";
import Expression from "./Expression";
import Statement from "./Statement";
import BlockStatement from "./Statement/BlockStatement";

export default class Program extends Tree{
  constructor(ast:tProgram){
    super(ast); 
  }
  evaluate(context:Context){
    let ast = this.ast as tProgram
    return new BlockStatement(ast as unknown as tBlockStatement).evaluate(context)
  }
}