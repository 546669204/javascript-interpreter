import Tree from "@/Tree/Tree"
import Context from "@/context"
import type { BlockStatement as tBlockStatement, Statement as tStatement, Node as tNode } from '@babel/types';
import Statement from "./index";
import { Signal } from "@/signal";
import globalObject from "@/context/globalObject";
import { logger } from "@/utils";
import { traverseFast } from "@/traverse";

// 产生式 StatementList :StatementList Statement 按照下面的过程执行 :

// 令 sl 为解释执行 StatementList 的结果。
// 如果 sl 是个非常规完结，返回 sl。
// 令 s 为解释执行 Statement 的结果。
// 如果有一个异常被抛出，返回 (throw, V, empty)，这里的 V 是异常。 ( 仿佛没有抛出异常一样继续运行。)
// 如果 s.value 是 empty ，令 V = sl.value, 否则令 V = s.value。
// 返回 (s.type, V, s.target)。

const hoisting = new WeakMap();

export default class BlockStatement extends Tree {
  constructor(ast: tBlockStatement) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tBlockStatement;
    let body = ast.body;
    // 申明提前



    const prefix = [] as tStatement[];
    const useStrict = ast.directives.some(node => {
      return node.value.value == "use strict"
    })
    context.useStrict = useStrict;

    // if (!hoisting.has(ast)) {
      // hoisting.set(ast, true)
      traverseFast(ast, function (node: tNode) {
        if (node.type == "FunctionDeclaration") {
          prefix.push(node);
          return true;
        }
        if (node.type == "FunctionExpression") {
          return true;
        }
        if (node.type == "VariableDeclaration") {
          node.declarations.forEach(it => {
            if (it.id.type != "Identifier") {
              throw "BlockStatement 不支持 " + it.id.type
            }
            if (it.id.name == "arguments" && context.env.isFunctionScoped) {
              // 跳过 hoisting
              return;
            }
            const env = context.env.getFunctionEnvironment()
            if(!env.vars[it.id.name]){
              env.def(it.id.name).kind = node.kind;
            }
          })
        }
      });
    // }

    body = prefix.concat(body);
    var V = undefined;
    for (let i = 0; i < body.length; i++) {
      const node = body[i];
      const s = new Statement(node, { hoisting: i < prefix.length ? true : false }).evaluate(context);
      if (s instanceof Signal) {
        if (s.value != undefined) {
          V = s.value;
        }
        if (s.type != "normal") {
          if (s.type == "return") {
            return s;
          }
          return new Signal({
            ...s, value: V
          });
        }
      } else if (s != undefined) {
        V = s;
      }
    }
    return V;
  }
}