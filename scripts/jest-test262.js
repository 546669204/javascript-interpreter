const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const base = path.join(__dirname, "../");
const node_modules = path.join(base, "./node_modules/")


function walk(filePath, cb) {
  fs.readdirSync(filePath).forEach(fileName => {
    const p = path.join(filePath, fileName);
    if (fs.statSync(p).isDirectory()) {
      walk(p, cb)
    } else {
      cb({
        filePath,
        fileName,
        url: p
      })
    }
  })
}


fs.mkdirSync(path.join(node_modules, ".cache"), {
  recursive: true
});
const hasTest262 = fs.existsSync(path.join(node_modules, "./.cache/git_test262"))
if (!hasTest262) {
  console.log("下载test262规范-测试用例")
  child_process.execSync("git clone https://github.com/tc39/test262.git --depth=1 git_test262", {
    cwd: path.join(node_modules, "./.cache/"),
    stdio: 'inherit'
  })
}

const test262base = path.join(node_modules, "./.cache/git_test262/test/");
const test262ByExpressions = path.join(node_modules, "./.cache/git_test262/test/language/expressions/");
const test262ByStatements = path.join(node_modules, "./.cache/git_test262/test/language/statements/");
[test262ByExpressions, test262ByStatements].forEach((p => {
        walk(p, ({
              filePath,
              fileName,
              url
            }) => {
              const test262dir = path.join(base, "test/test262/", filePath.replace(test262base, ""));
              const content = fs.readFileSync(url).toString();
              if (content.includes("phase: parse") || /S11\.13\.2_A6\.\d+\_T1/.test(fileName) || /S11\.13\.1_A6\.\d+\_T1/.test(fileName)) {
                return;
              }
              if (content.includes("es5id")) {
                fs.mkdirSync(test262dir, {
                  recursive: true
                });
                fs.writeFileSync(path.join(test262dir, fileName + ".test.js"), `
  /**
   * @jest-environment jsdom
   */
  import {evaluate} from '@/dist/testjest';
  
  test('${fileName}', () => {
    const fn = () => {
      try{
        evaluate(\`${(content.replace(/[`\\]/gi,function(v){
          return "\\"+v
        }))}\`);
      }catch(e){
        throw ""+e
      }
    };
    expect(fn).not.toThrow();
  });
      `)
    }
  })
}))

console.log("执行jest")
child_process.execSync("node ./node_modules/.bin/jest",{stdio:"inherit"})