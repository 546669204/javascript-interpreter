import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { EmptyStatement as tEmptyStatement } from '@babel/types';
import Statement from "./index";
import Cache from "../cache"

export default class EmptyStatement extends Tree {
  constructor(ast: tEmptyStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tEmptyStatement;
    // 啥也不干
  }
}