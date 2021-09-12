import { FunctionDeclaration, FunctionExpression } from "@babel/types"
import Context from "./context";
import Statement from "./Tree/Statement";
import { Signal } from "./signal"
import { getGlobalValue } from "./context/globalObject";
import { Base64 } from 'js-base64';

var c = {
  log:console.log,
  debug:console.debug
};

export function logger() {

}
logger.disabled = function () {
  const e = function () { 
    loggerQueue.push(Array.from(arguments));
    if(loggerQueue.length > loggerLimit){
      loggerQueue.shift();
    }
  };
  // @ts-ignore
  c = {
    log: e,
    debug: e
  }
}
// @ts-ignore
let loggerQueue: any[] = window.loggerQueue = [];
let loggerLimit = 100;
logger.log = function () {
  try {
    // @ts-ignore
    c.log.apply(c, arguments)
  } catch (error) {

  }
} as any

logger.debug = function () {
  try {
    // @ts-ignore
    c.debug.apply(c, arguments)
  } catch (error) {

  }
} as any


export function forTimeOut() {
  var out = {
    time: Date.now(),
    check() {
      // if (Date.now() - this.time > 3000) {
        // throw "循环超时"
      // }
    }
  };
  return out
}


const wmap = new WeakMap();
export function getLabel(ast: any) {
  return wmap.get(ast);
}
export function setLabel(ast: any, value: string) {
  return wmap.set(ast, value);
}

let vmScriptId= 0;
export function ProxyFunction(ast: FunctionDeclaration | FunctionExpression, context: Context) {
  let fnName = "";
  if (ast.id?.name) {
    fnName = ast.id?.name;
  }
  const fn = function (...args: any[]) {
    // @ts-ignore
    var that = this;
    const env = context.env.children();
    env.isFunctionScoped = true;
    env.def("arguments").set(args)
    env.vars["arguments"].kind = "arguments"
    if (fnName) {
      env.def(fnName).set(fn)
    }
    ast.params.map((node, index) => {
      if (node.type == "RestElement") {
        throw "不支持 RestElement"
      }
      if (node.type == "ArrayPattern") {
        throw "不支持 ArrayPattern"
      }
      if (node.type == "AssignmentPattern") {
        throw "不支持 AssignmentPattern"
      }
      if (node.type == "ObjectPattern") {
        throw "不支持 ObjectPattern"
      }
      env.def(node.name).set(args[index]);
    })
    // @ts-ignore
    args.callee = fn;
    Object.defineProperty(args, "isArgument", {
      get() {
        return true;
      },
      enumerable: false,
      configurable: false
    })

    try {
      const s = new Statement(ast.body).evaluate(context.clone({ ...context, env, this: that }));
      logger.debug("ProxyFunction", s)
      if (s instanceof Signal) {
        if (s.type == "return") {
          return s.value;
        }
      }
    } finally {
      context.env.updateWithParent();
    }
    return undefined;
  }
  // 修复 原型链
  fn.__proto__ = getGlobalValue("Function").prototype;
  fn.prototype.__proto__ = getGlobalValue("Object").prototype;
  fn.constructor = getGlobalValue("Function");
  Object.defineProperty(fn, "length", {
    value: ast.params.length
  })
  const fnToString = context.code.get(ast);
  Object.defineProperty(fn, "toString", {
    value: function () {
      return fnToString;
    },
    writable:true,
    enumerable: false,
    configurable: true
  })
  fn.displayName = fnName;
  const rawSourceMap = {
    // -version：Source map的版本。
    // -file：转换后的文件名。
    // -sourceRoot：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
    // -sources：转换前的文件。该项是一个数组，表示可能存在多个文件合并。
    // -names：转换前的所有变量名和属性名。
    // -mappings：记录位置信息的字符串，下文详细介绍。
    version: 3,
    file: "min.js",
    names: [],
    sources: [vmScriptId++ + ".js"],
    sourceRoot: "",
    sourcesContent: [fnToString],
    mappings: "AAAA,AAAA,IAAI,AAAC,CACD,UAAU,CAAE,IAAI,CACnB,AACD,AAAA,GAAG,AAAC,CACA,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,CACnB"

  }
  return fn;
  // return eval(`
  // (function(){
  //   return fn;
  // })()
  // //....@ sourceURL=a123.js
  // //@ sourceMappingURL=data:application/json;base64,${Base64.encode(JSON.stringify(rawSourceMap))}
  // `);
}