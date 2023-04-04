const path = require("path");
const types = require("babel-types");
const generate = require("babel-generator").default;
const traverse = require("babel-traverse").default;
class NormalModule {
  constructor({ name, context, rawRequest, resource, parser }) {
    this.name = name;
    this.context = context; // C:\aproject\xxxx\8.my
    this.rawRequest = rawRequest; // src\index.js
    // C:\aproject\xxxx\8.my\src\index.js
    this.resource = resource; // 这是这个模块的绝对路径
    // 这是AST解析器,可以把源代码转成AST抽象语法树
    this.parser = parser;
    // 此模块对应的源代码
    this._source;
    // 此模块对应的AST抽象语法树
    this._ast;
  }

  /**
   * 编译本模块
   * @param {*} compilation
   * @param {*} callback
   *
   * 模块编译流程
   * 1.从硬盘上把模块内容读出来,读成一个文本
   * 2.可能它不是一个JS模块,所以会可能要走loader的转换,最终肯定要得到一个JS模块代码,得不到就报错了
   * 3.把这个JS模块代码经过parser处理转成抽象语法树AST
   * 4.分析AST里面的依赖,也就是找 require import节点,分析依赖的模块
   * 5.递归的编译依赖的模块
   * 6.不停的依次递归执行上面5步,直到所有的模块都编译完成为止
   *
   */
  build(compilation, callback) {
    this.doBuild(compilation, () => {
      // 得到语法树
      this._ast = this.parser.parse(this._source);
      // 遍历语法树,找到里面的依赖进行收集依赖
      traverse(this._ast, {
        // 当遍历到CallExpression节点的时候,就会进入回调
        CallExpression: (nodePath) => {
          let node = nodePath.node; //获取节点
          // 如果方法名是require方法的话
          if (node.callee.name === "require") {
            let moduleName = node.arguments[0].value; //1.模块的名称
            // 2.获得可能的扩展名
            let extName =
              moduleName.split(path.posix.sep).pop().indexOf(".") == -1
                ? ".js"
                : "";
            // 3.获取依赖模块(./src/title.js)的绝对路径 win \ linux /
            // path.posix永远使用linux /，统一使用linux /
            // path.posix.dirname(this.resource)获取 C:\aproject\xxxx\8.my\src\index.js所在的目录即C:\aproject\xxxx\8.my\src
            // 依赖的绝对路径 C:\aproject\xxx\8.my\src\title.js
            let depResource = path.posix.join(
              path.posix.dirname(this.resource),
              moduleName + extName
            );
            // 4.依赖的模块ID ./+从根目录出发到依赖模块的绝对路径的相对路径
            let depModuleId =
              "./" + path.posix.relative(this.context, depResource);

            console.log("depModuleId", depModuleId);
          }
        },
      });
      // callback();
    });
  }

  /**
   * 1.读取模块的源代码
   * @param {*} compilation
   * @param {*} callback
   */
  doBuild(compilation, callback) {
    // source读到的源代码
    this.getSource(compilation, (err, source) => {
      this._source = source;
      callback(err);
    });
  }

  /**
   * 读取真正的源代码
   */
  getSource(compilation, callback) {
    // fs.readFile读文件
    compilation.inputFileSystem.readFile(this.resource, "utf8", callback);
  }
}

module.exports = NormalModule;

/**
 * 非常的重要的问题
 * 模块的ID的问题
 * 不管你是相对的本地模 块,还是三方模块
 * 最后它的moduleId 全部都一个相对相对于项目根目录打对路径
 * ./src/title.js
 * ./src/index.js
 * ./node_modules/util/util.js
 * 路径分隔符一定是linux /,而非window里的\
 */
