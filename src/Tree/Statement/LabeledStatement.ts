import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { LabeledStatement as tLabeledStatement } from '@babel/types';
import Statement from "./index";
import { setLabel } from "@/utils";

export default class LabeledStatement extends Tree {
  constructor(ast: tLabeledStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tLabeledStatement;
    let label = ast.label.name;
    try {
      setLabel(ast.body,label)
      return new Statement(ast.body).evaluate(context.clone({ ...context, label }))
    } catch (error:any) {
      if (error && error.type == "break" && error?.label == label) {
        return;
      }
      if (error && error.type == "continue" && error?.label == label) {
        return;
      }
      throw error;
    }
  }
}