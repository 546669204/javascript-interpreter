import { getGlobalValue } from "./context/globalObject";

function assert(c: any) {
  // if (!c) {
  //   throw "assert";
  // }
}
assert.prototype = {
  sameValue(c: any, t: any, m: any) {
    if(isNaN(c) && isNaN(t))return;
    if (c != t) {
      throw m;
    }
  },
  notSameValue(c: any, t: any, m: any) {
    if (c == t) {
      throw m;
    }
  },
  throws(errorClass:any,cb:Function){
    try {
      cb();
    } catch (error:any) {
      if(error.name && ["Error","EvalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"].includes(error.name)){
        const stack = error.stack;
        error = new (getGlobalValue(error.name))(error.message);
        error.stack = stack;
      }
      if(error instanceof errorClass){
        return;
      }
      throw error;
    }
  }
}
Object.assign(assert,assert.prototype)


export default assert;