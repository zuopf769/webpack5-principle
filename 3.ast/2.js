const core = require('@babel/core');
const types = require('@babel/types');
const arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions');
let arrowFunctionPlugin2 = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { node } = path;
      node.type = 'FunctionExpression';
      hoistFunctionEnvironment(path);
      const body = node.body;
      //判断body节点是不是BlockStatement
      if (!types.isBlockStatement(body)) {
        //快速方便的构建节点
        node.body = types.blockStatement(
          [types.returnStatement(body)]
        );
      }
    }
  }
}
function hoistFunctionEnvironment(path) {
  //1.看看当前节点里有没有使用到this
  const thisPaths = getThisPaths(path);
  if (thisPaths.length > 0) {
    //可以用来生成_this变量的路径
    const thisEnv = path.findParent(parent => {
      //如果是函数，但是不是箭头函数的话就返回true
      //return types.isFunctionDeclaration(parent)|| parent.isProgram();;
      return (parent.isFunction() && !parent.isArrowFunctionExpress()) || parent.isProgram();
    });
    let thisBindings = '_this';
    //如果此路径对应的作用域中没_this这个变量
    if (!thisEnv.scope.hasBinding(thisBindings)) {
      //向它对应的作用域里添加一个变量 ，变量名_this,变量的值this
      const thisIdentifier = types.identifier(thisBindings);
      thisEnv.scope.push({
        id: thisIdentifier,
        init:types.thisExpression()
      });
      thisPaths.forEach(thisPath => {
        thisPath.replaceWith(thisIdentifier);
      });
    }
  }
}
function getThisPaths(path) {
  let thisPaths = [];
  //遍历此路径所有的子路径
  path.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    }
  });
  return thisPaths;
}
//这是JS源代码，用字符串表示
const sourceCode = `

const sum = (a,b)=>{

  const minis = (a,b)=>{
    console.log(this);
    return a-b;
  }
  return a+b;
}
`;
const result = core.transform(sourceCode, {
  plugins:[arrowFunctionPlugin2]
});
console.log(result.code);

/**
var _this = this;
const sum = (a,b)=>{
   console.log(_this);
  return a+b;
}
 */