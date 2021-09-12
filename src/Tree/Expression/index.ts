import Tree from "@/Tree/Tree"
import Context from "../../context"
import { isLiteral } from "@babel/types"
import type { Node as tNode } from '@babel/types';
import Literal from "../Literal";
import Identifier from "../Identifier";
import VariableDeclaration from "../Statement/VariableDeclaration"
import Cache from "@/Tree/cache"
import { logger } from "@/utils";

// @ts-ignore
const modules = require.context('./', false, /\.ts$/);
const cache: {
  [key: string]: any
} = {};

function importAll(r: { (arg0: any): any; keys: () => any[]; }) {
  r.keys().forEach((key: string | number) => {
    const name = (<string>key).replace("./", "").replace(".ts", "")
    cache[name] = r(key)
  });
}
importAll(modules)

cache["VariableDeclaration"] = { default: VariableDeclaration };
export default class Expression extends Tree {
  opts: {
    parent?: string
  };
  constructor(ast: tNode, opts?: Object) {
    super(ast);
    this.opts = opts || {};
  }
  evaluate(context: Context): any {
    let ast: tNode = this.ast;
    Cache.currentAst = ast;
    if (isLiteral(ast)) {
      return new Literal(ast).evaluate(context);
    }
    if (ast.type == "Identifier") {
      return new Identifier(ast, this.opts).evaluate(context);
    }
    if (cache[ast.type]) {
      return new cache[ast.type].default(ast, this.opts).evaluate(context);
    }
    logger.log("Expression", "不支持的", context.code.get(ast))
    throw `Expression 不支持的` + ast.type;
  }
}