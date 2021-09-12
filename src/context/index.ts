import Environment from "./Environment";
import GlobalEnv from "./globalObject"
export default class Context {
  env: Environment
  this: Object | undefined;
  useStrict: boolean = false;
  code: (String & { get: Function });
  break: boolean | string = false;
  continue: boolean | string = false;
  label:string = "";
  callProperty:string = "";
  constructor() {
    this.env = GlobalEnv.children();
    this.this = undefined;
    // @ts-ignore
    this.code = new String();
    this.code.get = function () { }
  }
  clone(op:any){
    const c = new Context()
    Object.assign(c,op);
    return c;
  }
}
