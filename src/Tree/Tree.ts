import type { Node as tNode } from '@babel/types';

export default class Tree {
  ast:tNode;
  constructor(ast:tNode){
    this.ast = ast;
  }
}