import { logger } from "./utils";
import {evaluate as evall} from "./main"
import assert from "./assert"

logger.disabled();

export function evaluate (code:any){
  const w = {
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
  return evall(code,w)
}