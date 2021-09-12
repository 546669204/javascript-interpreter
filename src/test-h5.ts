import { evaluate } from "./main"
import assert from "./assert"
import { logger } from "./utils";
import { resetGlobal } from "./context/globalObject";
// @ts-ignore
// const modules = require.context('../test262/test/built-ins/String', true, /\.js$/);
// const modules = require.context('../test262/test/language/statements', true, /\.js$/);
const modules = require.context('../test262/test/language/expressions', true, /\.js$/);
let test262 = modules.keys().map(modules);

// @ts-ignore
window.evaluate = evaluate;
// @ts-ignore
const win = window.evaluateContext = {
  assert,
  isConstructor(f: any) {
    try {
      new f();
    } catch (err) {
      // verify err is the expected error and then
      return false;
    }
    return true;
  },
  verifyEnumerable(o: object, key: string) {
    if (!Object.getOwnPropertyDescriptor(o, key)?.enumerable) {
      throw "verifyEnumerable"
    }
  },
  verifyNotEnumerable(o: object, key: string) {
    if (Object.getOwnPropertyDescriptor(o, key)?.enumerable) {
      throw "verifyNotEnumerable"
    }
  },
  verifyWritable(o: object, key: string) {
    if (!Object.getOwnPropertyDescriptor(o, key)?.writable) {
      throw "verifyWritable"
    }
  },
  verifyNotWritable(o: object, key: string) {
    if (Object.getOwnPropertyDescriptor(o, key)?.writable) {
      throw "verifyNotWritable"
    }
  },
  verifyConfigurable(o: object, key: string) {
    if (!Object.getOwnPropertyDescriptor(o, key)?.configurable) {
      throw "verifyNotEnumerable"
    }
  },
  verifyNotConfigurable(o: object, key: string) {
    if (Object.getOwnPropertyDescriptor(o, key)?.configurable) {
      throw "verifyNotConfigurable"
    }
  },
  verifyProperty() {

  },
  Test262Error: class Test262Error extends Error {}
}

var count = 0;
test262 = test262.filter((code: string) => code.includes("es5id"))
  .filter((code: string) => !code.includes("phase: parse")).filter((code: string) => {
    const black: string[] = [
      "S11.13.1",
      "S11.13.2"
    ];
    if (code.includes("$262") || black.some(it => code.includes(it))) {
      return false;
    }
    return true
  });

for (const code of test262) {
  count++;
  console.log(`pass ${count} total ${test262.length}`)
  if (count < localStorage.pass) {
    continue;
  }

  try {
    resetGlobal();
    evaluate(code, win)
  } catch (error) {
    console.error(error)
    console.log(code)
    break
  }
  localStorage.pass = count;
}

// @ts-ignore
window.runTest = function () {
  count = 0;
  // 开始 累计
  logger.disabled();
  for (const code of test262) {

    try {
      resetGlobal();
      evaluate(code, win)
      count++;
    } catch (error) {
      console.log(error,code)
    }
  }
  console.log(`pass ${count} total ${test262.length}`)
  // 结束
}
