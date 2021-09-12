import Environment,{Var} from "./Environment";
import {evaluate} from "../main"
var globalObject = new Environment();
// 拓展内置方法
globalObject.vars = {};
// 从 iframe 里面获取干净的对象
var inner:any;
resetInner();
function resetInner(){
  var s = document.createElement("iframe");
  document.body.appendChild(s)
  const iwin:any = s.contentWindow?.window as any;
  var Function = function (this: any,...args:string[]){
    const params = args.slice(0,args.length - 1);
    const body = args[args.length-1] || "";
    return evaluate(`(function anonymous(${params.join(",")}){${body}})`)
  }
  Function.prototype = iwin.Function.prototype;
  inner = {
    eval(code:string,c:any){
      return evaluate(code,c);
    },
    isFinite:iwin.isFinite,
    isNaN:iwin.isNaN,
    parseFloat:iwin.parseFloat,
    parseInt:iwin.parseInt,
    decodeURI:iwin.decodeURI,
    decodeURIComponent:iwin.decodeURIComponent,
    encodeURI:iwin.encodeURI,
    encodeURIComponent:iwin.encodeURIComponent,
  
    String:iwin.String,
    RegExp:iwin.RegExp,
    Object:iwin.Object,
    Function:Function,
    Boolean:iwin.Boolean,
    Symbol:iwin.Symbol,
    Array:iwin.Array,
    JSON:iwin.JSON,
  
    Promise:iwin.Promise,
  
    Error:iwin.Error,
    // AggregateError:iwin.AggregateError,
    EvalError:iwin.EvalError,
    // InternalError:iwin.InternalError,
    RangeError:iwin.RangeError,
    ReferenceError:iwin.ReferenceError,
    SyntaxError:iwin.SyntaxError,
    TypeError:iwin.TypeError,
    URIError:iwin.URIError,
  
    Number:iwin.Number,
    BigInt:iwin.BigInt,
    Math:iwin.Math,
    Date:iwin.Date,
  
    Map:iwin.Map,
    Set:iwin.Set,
    WeakMap:iwin.WeakMap,
    WeakSet:iwin.WeakSet,
  
    setTimeout:iwin.setTimeout,
    setInterval:iwin.setInterval,
    clearInterval:iwin.clearInterval,
    clearTimeout:iwin.clearTimeout,
  
    console:iwin.console,
    NaN:iwin.NaN,
    Infinity:iwin.Infinity,


    btoa:iwin.btoa,
    atob:iwin.atob,

    navigator:window.navigator,
    location:window.location,
    document:window.document,

    addEventListener:window.addEventListener,

    ArrayBuffer:iwin.ArrayBuffer,
    SharedArrayBuffer:iwin.SharedArrayBuffer,
    DataView:iwin.DataView,
    postMessage:iwin.postMessage,
    PromiseRejectionEvent:iwin.PromiseRejectionEvent,
    Reflect:iwin.Reflect,

    Int8Array:iwin.Int8Array,
    Int16Array:iwin.Int16Array,
    Int32Array:iwin.Int32Array,
    URL:iwin.URL,

    URLSearchParams:iwin.URLSearchParams,
    XMLHttpRequest:window.XMLHttpRequest,
    localStorage:window.localStorage,
    sessionStorage:window.sessionStorage,
    
    __defineGetter__:iwin.__defineGetter__,
    __defineSetter__:iwin.__defineSetter__,
    self:windowObject,
    FormData:iwin.FormData,
    MessageChannel:iwin.MessageChannel,
    Proxy:iwin.Proxy,
    requestAnimationFrame:iwin.requestAnimationFrame,
  }
  Object.assign(window,{
    Error:iwin.Error,
    EvalError:iwin.EvalError,
    RangeError:iwin.RangeError,
    ReferenceError:iwin.ReferenceError,
    SyntaxError:iwin.SyntaxError,
    TypeError:iwin.TypeError,
    URIError:iwin.URIError,
  })
  globalObject.vars = {};
  Object.keys(inner).forEach(name=>{
    globalObject.vars[name] = new Var(name);
    // @ts-ignore
    globalObject.vars[name].set(inner[name])
  })
  
  s.remove();
}




export default globalObject;

export function resetGlobal(){
  resetInner();
}


const windowObject = {};
export function getWindow(){
  const window = Object.keys(globalObject.vars).reduce((acc, pre) => {
    acc[pre] = globalObject.vars[pre].get();
    return acc;
  }, windowObject as { [key: string]: any });
  if(!window.___this_var___){
    Object.defineProperty(window,"___this_var___",{
      get(){
        return globalObject;
      },
      enumerable:false,
      configurable:false,
    })
  }
  return window
}

export function getGlobalValue(name:string):any{
  return inner[name];
}