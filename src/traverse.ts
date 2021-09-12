
import { VISITOR_KEYS } from "@babel/types"

export  function traverseFast(node: any, enter: Function, opts = {}) {
  if (!node) return;
  const keys = VISITOR_KEYS[node.type];
  if (!keys) return;
  opts = opts || {};
  const s = enter(node, opts);

  if (s) {
    return;
  }
  for (const key of keys) {
    const subNode = node[key];
    if (Array.isArray(subNode)) {
      for (const node of subNode) {
        traverseFast(node, enter, opts);
      }
    } else {
      traverseFast(subNode, enter, opts);
    }
  }
}