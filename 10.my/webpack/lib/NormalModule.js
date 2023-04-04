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
      callback();
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
