import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { Statement as tStatement } from '@babel/types';
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
export default class Statement extends Tree {
  opts: any;
  constructor(ast: tStatement,opts?:any) {
    super(ast);
    this.opts = opts;
  }
  evaluate(context: Context) {
    let ast = this.ast as tStatement
    if (cache[ast.type]) {
      Cache.currentAst = ast;
      return new cache[ast.type].default(ast,this.opts).evaluate(context);
    }
    logger.log("Statement", "不支持的", context.code.get(ast))
    throw `Statement 不支持的` + ast.type;
  }
}