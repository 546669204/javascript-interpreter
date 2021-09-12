import Tree from "@/Tree/Tree"
import Context from "../../context"
import type { CallExpression as tCallExpression } from '@babel/types';
import Expression from ".";
import Cache from "../cache"
import { logger } from "@/utils";
import { evaluate } from "@/main";
let currentRequireId = 100000;
export default class CallExpression extends Tree {
  constructor(ast: tCallExpression) {
    super(ast);
  }
  evaluate(context: Context) {
    let ast = this.ast as tCallExpression;
    if (ast.callee.type == "V8IntrinsicIdentifier") {
      throw "不支持V8IntrinsicIdentifier"
    }
    if(context.code.get(context) == 'n("Vtdi")'){
      debugger
    }
    let callee;
    let callProperty;
    if (ast.callee.type == "MemberExpression") {
      callee = new Expression(ast.callee.object).evaluate(context);
      if (ast.callee.property.type == "PrivateName") {
        throw "不支持PrivateName"
      }
      // 是否动态获取
      let computed = ast.callee.computed;
      let property = new Expression(ast.callee.property, { parent: computed ? undefined : "MemberExpression" }).evaluate(context);
      callProperty = property;
      if(callee.___this_var___){
        callee = callee[callProperty];
        callProperty = undefined;
      }
    } else {
      callee = new Expression(ast.callee, { parent: "CallExpression" }).evaluate(context);
    }

    let args = ast.arguments.map(node => {
      if (node.type == "JSXNamespacedName") {
        throw "不支持JSXNamespacedName"
      }
      if (node.type == "SpreadElement") {
        throw "不支持SpreadElement"
      }
      if (node.type == "ArgumentPlaceholder") {
        throw "不支持ArgumentPlaceholder"
      }
      return new Expression(node).evaluate(context);
    })

    if (context.code.get(ast.callee) == "eval") {
      args.push(context)
    }
    logger.debug(
      "CallExpression\n",
      "callee:", callee, "\n",
      "args:", args, "\n",
      "code:", context.code.substring(ast.start || 0, ast.end || 0), "\n",
      callProperty
    )
    if(context.code.get(ast.callee) == `document.getElementsByTagName("head")[0].appendChild`){
      const el:any = args[0];
      const s = document.createElement("link");
      s.rel = "stylesheet";
      s.type = "text/css";
      s.onload = function(){
        el.onload();
      };
      s.onerror = function(){
        el.onerror();
      };;
      s.href = el.href;
      args[0] = s;
    }
    if(context.code.get(ast.callee) == "document.head.appendChild"){
      const el:any = args[0];
      if(el.tagName == "SCRIPT"){
        let url = el.src;
        const s = document.createElement("script");
        args[0] = s;
        s.onload = el.onload;

        fetch(url).then(res=>res.text()).then(res=>{
          s.innerText = `evaluate(${JSON.stringify(res)}) ;;;document.currentScript.onload()`;
        })
      }
    }
    var ret
    if (callProperty != undefined) {
      ret = callee[callProperty](...args)
    } else {
      ret = callee(...args);
    }
    logger.debug(
      "CallExpression\n",
      "callee:", callee, "\n",
      "args:", args, "\n",
      "code:", context.code.substring(ast.start || 0, ast.end || 0), "\n",
      "ret:", ret, "\n",
    )
    return ret
  }
}