import { parse } from "@babel/parser";
import Context from "./context";
import { Var } from "./context/Environment";
import Program from "./Tree/Program";
import { logger } from "./utils";

export function evaluate(code: string, context: object | Context = {}) {
  if (!code) {
    return undefined;
  }
  let ast = parse(code, {
    sourceType: "script",
    ranges: false,
    tokens:false
  });
  if (!ast) {
    throw "解析失败"
  }
  let program;
  program = ast.program;

  let c;
  if (context instanceof Context) {
    c = context.clone(context);
    // @ts-ignore
    c.code = new String(code);
    c.code.get = function (ast: any) {
      return this.substring(ast.start || 0, ast.end || 0)
    }
  } else {
    c = new Context();
    // @ts-ignore
    c.code = new String(code);
    c.code.get = function (ast: any) {
      return this.substring(ast.start || 0, ast.end || 0)
    }
    const env = c.env.children();
    Object.assign(c.env.vars, Object.keys(context).reduce((acc, key) => {
      // @ts-ignore
      acc[key] = new Var(key);
      // @ts-ignore
      acc[key].set(context[key])
      return acc;
    }, {}));
    c.env = env;
  }

  if (program.body.length == 0 && program.directives.length == 1) {
    return program.directives[0].value.value;
  }
  try {
    const s = new Program(program).evaluate(c);
    logger.debug("evaluate return", s)
    return s;
  } catch (error) {
    throw error;
  }
}
