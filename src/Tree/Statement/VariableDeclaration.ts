import Tree from "@/Tree/Tree"
import Context from "../../context"
import type {VariableDeclaration as tVariableDeclaration} from '@babel/types';
import Statement from "./index";
import Cache from "../cache"
import Expression from "../Expression";
import { logger } from "@/utils";

export default class VariableDeclaration extends Tree {
  constructor(ast: tVariableDeclaration) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tVariableDeclaration;
    let kind = ast.kind; // var let const
    ast.declarations.forEach(node=>{
      if(node.id.type != "Identifier"){
        throw "不支持 "+node.id.type
      }
      
      let id = node.id.name;
      let init = undefined;
      const env = context.env.getFunctionEnvironment()
      const varObj = env.get(id,true);
      varObj.kind = kind;
      if(node.init){
        init = new Expression(node.init).evaluate(context);
        context.env.get(id,true).set(init);
      }
      logger.debug("VariableDeclaration",id,init)
    })
  }
}