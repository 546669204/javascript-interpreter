import { logger } from "@/utils";
import globalObject, { getGlobalValue } from "./globalObject";

export class Var{
  name:string;
  value:any;
  kind:string = "";
  update:boolean = false;
  constructor(name:string){
    this.name = name;
    this.value = undefined
  }
  get isVar(){
    return true;
  }
  set(value:any){
    this.value = value;
    this.update = true;
  }
  get(){
    return this.value;
  }
}


export default class Environment {
  vars: {
    [name: string]: Var
  }
  parent: Environment | undefined;
  isFunctionScoped:boolean = false;
  withObject:any;
  constructor(parent?: Environment) {
    this.vars = {};
    this.parent = parent;
  }
  children() {
    return new Environment(this);
  }
  get(name: string,real?:boolean) {
    let scope: Environment | undefined = this;
    do {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        if(real){
          return scope.vars[name]
        }
        // logger.debug("Environment get",scope.vars[name],name)
        return scope.vars[name].get();
      }
    } while (scope = scope.parent);
    throw new (getGlobalValue("ReferenceError"))(`${name} is not defined`) 
  }
  getOrDefault(name: string, defaultValue?:any) {
    try {
      return this.get(name,true) || defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }
  def(name: string) {
    logger.debug("Environment def",name)
    return this.vars[name] = new Var(name);
  }
  set(name: string, value: any) {
    logger.debug("Environment set",name,value)
    this.vars[name].set(value);
  }
  getFunctionEnvironment(){
    let scope: Environment | undefined = this;
    do {
      if(scope.isFunctionScoped){
        return scope;
      }
      if(scope.parent == undefined){
        return scope;
      }
    } while (scope = scope.parent);
    return globalObject;
  }
  delete(name:string){
    let scope: Environment | undefined = this;
    do {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        if(scope.vars[name].kind){
          return false;
        }
        return delete scope.vars[name];
      }
    } while (scope = scope.parent);
    return true;
  }
  updateWith(){
    // 数据回填
    logger.debug("Environment updateWith",this.withObject,this.vars)
    this.withObject.___keys___.forEach((key:string)=>{
      if(this.vars[key]){
        if(this.vars[key].update){
          this.withObject[key] = this.vars[key].value;
        }
      }else{
        delete this.withObject[key];
      }
    })

    this.withObject.___keys___.forEach((key:string)=>{
      if(this.withObject[key]){
        this.get(key,true).set(this.withObject[key])
      }else{
        this.delete(key);
      }
    })

  }
  updateWithParent(){
    let scope: Environment | undefined = this;
    do {
      if (scope.withObject) {
        return scope.updateWith();
      }
    } while (scope = scope.parent);
    return false;
  }
}