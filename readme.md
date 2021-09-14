# Javascript-Interpreter
用js实现js的解释器。

### Expression

* [x] ArrayExpression       [1,2,3,...]
* [x] AssignmentExpression  a = 1
* [x] BinaryExpression      a>b
* [x] CallExpression        x()
* [x] ConditionalExpression x?a:b
* [x] FunctionExpression    var x = function(){}
* [x] LogicalExpression     a || b
* [x] MemberExpression      a.b.c
* [x] NewExpression         new x
* [x] ObjectExpression      {a:"1",...}
* [x] SequenceExpression    expression1,expression2,...
* [x] ThisExpression        this
* [x] UnaryExpression       !x/~x/...
* [x] UpdateExpression      x++/x--/...

### Statement

* [x] BlockStatement        {}
* [x] BreakStatement        break
* [x] ContinueStatement     continue
* [x] DoWhileStatement      do while
* [x] EmptyStatement        ;
* [x] ExpressionStatement   exp;
* [x] ForInStatement        for in
* [x] ForStatement          for 
* [x] FunctionDeclaration   function
* [x] IfStatement           if else 
* [x] LabeledStatement      label:
* [x] ReturnStatement       return 
* [x] SwitchStatement       switch
* [x] ThrowStatement        throw
* [x] TryStatement          try catch
* [x] VariableDeclaration   var let const
* [x] WhileStatement        while
* [x] WithStatement         with

### TEST

```sh
# 安装依赖
yarn
# 构建成果
yarn build
# 运行jest测试
yarn test
```

### TODO

* [ ] 递归转循环
* [ ] 效率升级
* [x] jest test262 测试用例

### dep

https://github.com/facebook/jest  
https://github.com/acornjs/acorn  
https://github.com/babel/babel  

https://262.ecma-international.org/5.1/#sec-12.1  
https://developer.mozilla.org/  
https://astexplorer.net/  
https://github.com/tc39/test262  