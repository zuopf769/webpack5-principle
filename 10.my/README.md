# 手写 webpack

## 1.跑通 webpack

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/04/03/17-28-39-7f17b21542b7d23b1c1ca144aac25de8-20230403172837-6c53d5.png)

### 1.1 webpack.config.js

```js
const path = require("path");
module.exports = {
  context: process.cwd(),
  mode: "development",
  devtool: "none",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
};
```

### 1.2 src\index.js

```js
let title = require("./title");
console.log(title);
```

### 1.3 src\title.js

```js
module.exports = "title";
```

### 1.4 debugger.js

```shell
node debugger.js
```

```js
const webpack = require("webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      entries: true,
      chunks: true,
      modules: true,
      assets: true,
    })
  );
});
```

```json
{
  errors: [],
  warnings: [],
  version: '4.43.0',
  hash: 'b8d9a2a39e55e9ed6360',
  time: 64,
  builtAt: 1589509767224,
  publicPath: '',
  outputPath: 'C:\\vipdata\\prepare12\\xxx\\dist',
  assetsByChunkName: { main: 'main.js' },
  assets: [
    {
      name: 'main.js',
      size: 4126,
      chunks: [Array],
      chunkNames: [Array]
    }
  ],
  entrypoints: {
    main: {
      chunks: [Array],
      assets: [Array],
    }
  },
  namedChunkGroups: {
    main: {
      chunks: [Array],
      assets: [Array]
    }
  },
  chunks: [
    {
      id: 'main',
      rendered: true,
      initial: true,
      entry: true,
      size: 77,
      names: [Array],
      files: [Array],
      hash: '1e1215aa688e72e663af',
      siblings: [],
      parents: [],
      children: [],
      childrenByOrder: [Object: null prototype] {},
      modules: [Array],
      filteredModules: 0,
      origins: [Array]
    }
  ],
  modules: [
    {
      id: './src/index.js',
      identifier: 'C:\\vipdata\\prepare12\\xxx\\src\\index.js',
      name: './src/index.js',
      index: 0,
      index2: 1,
      size: 52,
      cacheable: true,
      built: true,
      optional: false,
      prefetched: false,
      chunks: [Array]
      assets: [],
      reasons: [Array],
      source: "let title = require('./title');\r\nconsole.log(title);"
    },
    {
      id: './src/title.js',
      identifier: 'C:\\vipdata\\prepare12\\xxx\\src\\title.js',
      name: './src/title.js',
      index: 1,
      index2: 0,
      size: 25,
      cacheable: true,
      built: true,
      optional: false,
      prefetched: false,
      chunks: [Array],
      issuer: 'C:\\vipdata\\prepare12\\xxx\\src\\index.js',
      issuerId: './src/index.js',
      issuerName: './src/index.js',
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [Array],
      source: "module.exports = 'title';"
    }
  ]
}
```

### 1.5 main.js

```js
(function (modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    module.l = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  __webpack_require__.p = "";
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function (module, exports, __webpack_require__) {
    let title = __webpack_require__(/*! ./title */ "./src/title.js");
    console.log(title);
  },
  "./src/title.js": function (module, exports) {
    module.exports = "title";
  },
});
```

## 2. Compiler.run

### 2.1 debugger.js

```js
+const webpack = require("./webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
    console.log(
        stats.toJson({
            entries: true,
            chunks: true,
            modules: true,
            assets: true
        })
    );
});
```

### 2.2 webpack\index.js

```js
const NodeEnvironmentPlugin = require("./plugins/NodeEnvironmentPlugin");
const Compiler = require("./Compiler");
function webpack(options) {
  options.context = options.context || path.resolve(process.cwd());
  // 创建compiler
  let compiler = new Compiler(options.context);
  // 给compiler指定options
  compiler.options = Object.assign(compiler.options, options);
  //插件设置读写文件的API
  new NodeEnvironmentPlugin().apply(compiler);
  //调用配置文件里配置的插件并依次调用
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }
  return compiler;
}

module.exports = webpack;
```

### 2.3 Compiler.js

webpack\Compiler.js

```js
const { Tapable } = require("tapable");
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.options = {};
    this.context = context; //设置上下文路径
    this.hooks = {};
  }
  run(callback) {
    console.log("Compiler run");
    callback(null, {
      toJson() {
        return {
          entries: true,
          chunks: true,
          modules: true,
          assets: true,
        };
      },
    });
  }
}
module.exports = Compiler;
```

### 2.4 NodeEnvironmentPlugin.js

webpack\plugins\NodeEnvironmentPlugin.js

```js
const fs = require("fs");
class NodeEnvironmentPlugin {
  apply(compiler) {
    compiler.inputFileSystem = fs; //设置读文件的模块
    compiler.outputFileSystem = fs; //设置写文件的模块
  }
}
module.exports = NodeEnvironmentPlugin;
```

## 3. 监听 make 事件

### 3.1 Compiler.js

```js
+const { Tapable, SyncBailHook, AsyncParallelHook } = require("tapable");
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
+       this.hooks = {
+            entryOption: new SyncBailHook(["context", "entry"]),
+            make: new AsyncParallelHook(["compilation"])
+       };
    }
    run(callback) {
        console.log("Compiler run");
        callback(null, {
            toJson() {
                return {
                    entries: true,
                    chunks: true,
                    modules: true,
                    assets: true
                }
            }
        });
    }
}
module.exports = Compiler;
```

### 3.2 webpack\index.js

```js
const NodeEnvironmentPlugin = require("./plugins/NodeEnvironmentPlugin");
+const WebpackOptionsApply = require("./WebpackOptionsApply");
const Compiler = require("./Compiler");
function webpack(options) {
    options.context = options.context || path.resolve(process.cwd());
    //创建compiler
    let compiler = new Compiler(options.context);
    //给compiler指定options
    compiler.options = Object.assign(compiler.options, options);
    //插件设置读写文件的API
    new NodeEnvironmentPlugin().apply(compiler);
    //调用配置文件里配置的插件并依次调用
    if (options.plugins && Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            plugin.apply(compiler);
        }
    }
+    new WebpackOptionsApply().process(options, compiler); //处理参数
    return compiler;
}

module.exports = webpack;
```

### 3.3 WebpackOptionsApply.js

```js
const EntryOptionPlugin = require("./plugins/EntryOptionPlugin");
module.exports = class WebpackOptionsApply {
  process(options, compiler) {
    //挂载入口文件插件
    new EntryOptionPlugin().apply(compiler);
    //触发entryOption事件执行
    compiler.hooks.entryOption.call(options.context, options.entry);
  }
};
```

### 3.4 EntryOptionPlugin.js

```js
onst SingleEntryPlugin = require("./SingleEntryPlugin");
class EntryOptionPlugin {
    apply(compiler) {
        compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
            new SingleEntryPlugin(context, entry, "main").apply(compiler);
        });
    }
}

module.exports = EntryOptionPlugin;
```

### 3.5 SingleEntryPlugin.js

```js
class EntryOptionPlugin {
  constructor(context, entry, name) {
    this.context = context;
    this.entry = entry;
    this.name = name;
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync(
      "SingleEntryPlugin",
      (compilation, callback) => {
        //入口文件 代码块的名称 context上下文绝对路径
        const { entry, name, context } = this;
        compilation.addEntry(context, entry, name, callback);
      }
    );
  }
}
module.exports = EntryOptionPlugin;
```

## 4. make 编译

### 4.1 Compiler.js

```js
+const { Tapable, SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require("tapable");
+const Compilation = require('./Compilation');
+const NormalModuleFactory = require('./NormalModuleFactory');
+const Stats = require('./Stats');
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
        this.hooks = {
            entryOption: new SyncBailHook(["context", "entry"]),
+            beforeRun: new AsyncSeriesHook(["compiler"]),
+            run: new AsyncSeriesHook(["compiler"]),
+            beforeCompile: new AsyncSeriesHook(["params"]),
+            compile: new SyncHook(["params"]),
+            make: new AsyncParallelHook(["compilation"]),
+            thisCompilation: new SyncHook(["compilation", "params"]),
+            compilation: new SyncHook(["compilation", "params"]),
+            done: new AsyncSeriesHook(["stats"])
        };
    }
+    run(finalCallback) {
+        //编译完成后的回调
+        const onCompiled = (err, compilation) => {
+            console.log('onCompiled');
+            finalCallback(err, new Stats(compilation));
+        };
+        //准备运行编译
+        this.hooks.beforeRun.callAsync(this, err => {
+            //运行
+            this.hooks.run.callAsync(this, err => {
+                this.compile(onCompiled); //开始编译,编译完成后执行conCompiled回调
+            });
+        });
+    }
+    compile(onCompiled) {
+        const params = this.newCompilationParams();
+        this.hooks.beforeCompile.callAsync(params, err => {
+            this.hooks.compile.call(params);
+            const compilation = this.newCompilation(params);
+            this.hooks.make.callAsync(compilation, err => {
+                console.log('make完成');
+                onCompiled(err, compilation);
+            });
+        });
+    }
+    newCompilationParams() {
+        const params = {
+            normalModuleFactory: new NormalModuleFactory()
+        };
+        return params;
+    }
+    newCompilation(params) {
+        const compilation = new Compilation(this);
+        this.hooks.thisCompilation.call(compilation, params);
+        this.hooks.compilation.call(compilation, params);
+        return compilation;
+    }
}
module.exports = Compiler;
```

### 4.2 Compilation.js

```js
const NormalModuleFactory = require("./NormalModuleFactory");
const { Tapable, SyncHook } = require("tapable");
const Parser = require("./Parser");
const parser = new Parser();
const path = require("path");
class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compiler = compiler;
    this.options = compiler.options;
    this.context = compiler.context;
    this.inputFileSystem = compiler.inputFileSystem;
    this.outputFileSystem = compiler.outputFileSystem;
    this.entries = [];
    this.modules = [];
    this.hooks = {
      succeedModule: new SyncHook(["module"]),
    };
  }
  //context ./src/index.js main callback(终级回调)
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      callback(err, module);
    });
  }
  _addModuleChain(context, entry, name, callback) {
    const moduleFactory = new NormalModuleFactory();
    let module = moduleFactory.create({
      name, //模块所属的代码块的名称
      context: this.context, //上下文
      rawRequest: entry,
      resource: path.posix.join(context, entry),
      parser,
    }); //模块完整路径

    this.modules.push(module);
    this.entries.push(module); //把编译好的模块添加到入口列表里面
    const afterBuild = () => {
      if (module.dependencies) {
        this.processModuleDependencies(module, (err) => {
          callback(null, module);
        });
      } else {
        return callback(null, module);
      }
    };
    this.buildModule(module, afterBuild);
  }
  buildModule(module, afterBuild) {
    module.build(this, (err) => {
      this.hooks.succeedModule.call(module);
      return afterBuild();
    });
  }
}
module.exports = Compilation;
```

### 4.3 NormalModuleFactory.js

```js
const NormalModule = require("./NormalModule");
class NormalModuleFactory {
  create(data) {
    return new NormalModule(data);
  }
}
module.exports = NormalModuleFactory;
```

### 4.4 NormalModule.js

```js
class NormalModule {
  constructor({ name, context, rawRequest, resource, parser }) {
    this.name = name;
    this.context = context;
    this.rawRequest = rawRequest;
    this.resource = resource;
    this.parser = parser;
    this._source = null;
    this._ast = null;
  }
  //解析依赖
  build(compilation, callback) {
    this.doBuild(compilation, (err) => {
      this._ast = this.parser.parse(this._source);
      callback();
    });
  }
  //获取模块代码
  doBuild(compilation, callback) {
    let originalSource = this.getSource(this.resource, compilation);
    this._source = originalSource;
    callback();
  }
  getSource(resource, compilation) {
    let originalSource = compilation.inputFileSystem.readFileSync(
      resource,
      "utf8"
    );
    return originalSource;
  }
}
module.exports = NormalModule;
```

### 4.5 Parser.js

```js
const babylon = require("babylon");
const { Tapable } = require("tapable");
class Parser extends Tapable {
  constructor() {
    super();
  }
  parse(source) {
    return babylon.parse(source, {
      sourceType: "module",
      plugins: ["dynamicImport"],
    });
  }
}
module.exports = Parser;
```

### 4.6 Stats.js

```js
class Stats {
  constructor(compilation) {
    this.entries = compilation.entries;
    this.modules = compilation.modules;
  }
  toJson() {
    return this;
  }
}
module.exports = Stats;
```

## 5. 编译模块和依赖

### 5.1 webpack\Compilation.js

```js
const NormalModuleFactory = require('./NormalModuleFactory');
+const async = require('neo-async');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.hooks = {
            succeedModule: new SyncHook(["module"])
        }
    }
    //context ./src/index.js main callback(终级回调)
+    _addModuleChain(context,entry,name,callback){
+        this.createModule({
+            name,//所属的代码块的名称 main
+            context:this.context,//上下文
+            rawRequest:entry,// ./src/index.js
+            resource:path.posix.join(context,entry),//此模块entry的的绝对路径
+            parser,
+        },module=>{this.entries.push(module)},callback);
+    }
+    createModule(data,addEntry,callback){
+        //先创建模块工厂
+        const moduleFactory = new NormalModuleFactory();
+        let module = moduleFactory.create(data);
+        //非常非常重要 模块的ID如何生成? 模块的ID是一个相对于根目录的相对路径
+        //index.js ./src/index.js title.js ./src/title.js
+        //relative返回一个相对路径 从根目录出出到模块的绝地路径 得到一个相对路径
+        module.moduleId = '.'+path.posix.sep+path.posix.relative(this.context,module.resource);
+        addEntry&&addEntry(module);
+        this.modules.push(module);//把模块添加到完整的模块数组中
+        const afterBuild = (err,module)=>{
+            if(module.dependencies){//如果一个模块编译完成,发现它有依赖的模块,那么递归编译它的依赖模块
+                this.processModuleDependencies(module,(err)=>{
+                    //当这个入口模块和它依赖的模块都编译完成了,才会让调用入口模块的回调
+                    callback(err,module);
+                });
+            }else{
+                callback(err,module);
+            }
+        }
+        this.buildModule(module,afterBuild);
+    }
+    processModuleDependencies(module,callback){
+        let dependencies= module.dependencies;
+        //因为我希望可以并行的同时开始编译依赖的模块,然后等所有依赖的模块全部编译完成后才结束
+        async.forEach(dependencies,(dependency,done)=>{
+            let {name,context,rawRequest,resource,moduleId} = dependency;
+            this.createModule({
+                name,
+                context,
+                rawRequest,
+                resource,
+                moduleId,
+                parser
+            },null,done);
+        },callback);
+    }
    buildModule(module,afterBuild){
        module.build(this,(err)=>{
            this.hooks.succeedModule.call(module)
            afterBuild(null,module);
        });
    }
}
module.exports = Compilation;
```

### 5.2 NormalModule.js

webpack\NormalModule.js

```js
+const path = require('path');
+const types = require('babel-types');
+const generate = require('babel-generator').default;
+const traverse = require('babel-traverse').default;
class NormalModule {
+    constructor({ name, context, rawRequest, resource, parser, moduleId }) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
+        this.moduleId = moduleId||('./'+path.posix.relative(context,resource));
        this.parser = parser;
        this._source = null;
        this._ast = null;
+        this.dependencies = [];
    }
    //解析依赖
    build(compilation, callback) {
        this.doBuild(compilation, err => {
+            let originalSource = this.getSource(this.resource, compilation);
+            // 将 当前模块 的内容转换成 AST
+            const ast = this.parser.parse(originalSource);
+            traverse(ast, {
+                // 如果当前节点是一个函数调用时
+                CallExpression: (nodePath) => {
+                    let node = nodePath.node;
+                    // 当前节点是 require 时
+                    if (node.callee.name === 'require') {
+                        //修改require为__webpack_require__
+                        node.callee.name = '__webpack_require__';
+                        //获取要加载的模块ID
+                        let moduleName = node.arguments[0].value;
+                        //获取扩展名
+                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
+                        //获取依赖模块的绝对路径
+                        let dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
+                        //获取依赖模块的模块ID
+                        let dependencyModuleId = '.' + path.posix.sep + path.posix.relative(this.context, dependencyResource);
+                        //添加依赖
+                        this.dependencies.push({
+                            name: this.name, context: this.context, rawRequest: moduleName,
+                            moduleId: dependencyModuleId, resource: dependencyResource
+                        });
+                        node.arguments = [types.stringLiteral(dependencyModuleId)];
+                    }
+                }
+            });
+            let { code } = generate(ast);
+            this._source = code;
+            this._ast = ast;
            callback();
        });
    }
    //获取模块代码
    doBuild(compilation, callback) {
        let originalSource = this.getSource(this.resource, compilation);
        this._source = originalSource;
        callback();
    }
    getSource(resource, compilation) {
        let originalSource = compilation.inputFileSystem.readFileSync(resource, 'utf8');
        return originalSource;
    }
}
module.exports = NormalModule;
```

## 6. seal

### 6.1 Compiler.js

```js
const { Tapable, SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require("tapable");
const Compilation = require('./Compilation');
const NormalModuleFactory = require('./NormalModuleFactory');
const Stats = require('./Stats');
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.options = {};
        this.context = context; //设置上下文路径
        this.hooks = {
            entryOption: new SyncBailHook(["context", "entry"]),
            beforeRun: new AsyncSeriesHook(["compiler"]),
            run: new AsyncSeriesHook(["compiler"]),
            beforeCompile: new AsyncSeriesHook(["params"]),
            compile: new SyncHook(["params"]),
            make: new AsyncParallelHook(["compilation"]),
            thisCompilation: new SyncHook(["compilation", "params"]),
            compilation: new SyncHook(["compilation", "params"]),
+           afterCompile:new AsyncSeriesHook(["compilation"]),
            done: new AsyncSeriesHook(["stats"])
        };
    }
    run(finalCallback) {
        //编译完成后的回调
        const onCompiled = (err, compilation) => {
            console.log('onCompiled');
            finalCallback(err, new Stats(compilation));
        };
        //准备运行编译
        this.hooks.beforeRun.callAsync(this, err => {
            //运行
            this.hooks.run.callAsync(this, err => {
                this.compile(onCompiled); //开始编译,编译完成后执行conCompiled回调
            });
        });
    }
    compile(onCompiled) {
        const params = this.newCompilationParams();
        this.hooks.beforeCompile.callAsync(params, err => {
            this.hooks.compile.call(params);
            const compilation = this.newCompilation(params);
            this.hooks.make.callAsync(compilation, err => {
+                compilation.seal(err => {
+                    this.hooks.afterCompile.callAsync(compilation, err => {
+                        return onCompiled(null, compilation);
+                    });
+                });
            });
        });
    }
    newCompilationParams() {
        const params = {
            normalModuleFactory: new NormalModuleFactory()
        };
        return params;
    }
    newCompilation(params) {
        const compilation = new Compilation(this);
        this.hooks.thisCompilation.call(compilation, params);
        this.hooks.compilation.call(compilation, params);
        return compilation;
    }

}
module.exports = Compiler;
```

### 6.2 Compilation.js

```js
const NormalModuleFactory = require('./NormalModuleFactory');
const async = require('neo-async');
const { Tapable, SyncHook } = require("tapable");
const Parser = require('./Parser');
const parser = new Parser();
const path = require('path');
+let Chunk = require('./Chunk');
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.modules = [];
        this.chunks = [];
        this.hooks = {
            succeedModule: new SyncHook(["module"]),
+            seal: new SyncHook([]),
+            beforeChunks: new SyncHook([]),
+            afterChunks: new SyncHook(["chunks"])
        }
    }
+    seal(callback) {
+        this.hooks.seal.call();
+        this.hooks.beforeChunks.call();//生成代码块之前
+        for (const module of this.entries) {//循环入口模块
+            const chunk = new Chunk(module);//创建代码块
+            this.chunks.push(chunk);//把代码块添加到代码块数组中
+            //把代码块的模块添加到代码块中
+            chunk.modules = this.modules.filter(module => module.name == chunk.name);
+        }
+        this.hooks.afterChunks.call(this.chunks);//生成代码块之后
+        callback();//封装结束
+    }
    //context ./src/index.js main callback(终级回调)
    _addModuleChain(context,entry,name,callback){
        this.createModule({
            name,//所属的代码块的名称 main
            context:this.context,//上下文
            rawRequest:entry,// ./src/index.js
            resource:path.posix.join(context,entry),//此模块entry的的绝对路径
            parser,
        },module=>{this.entries.push(module)},callback);
    }
    createModule(data,addEntry,callback){
        //先创建模块工厂
        const moduleFactory = new NormalModuleFactory();
        let module = moduleFactory.create(data);
        //非常非常重要 模块的ID如何生成? 模块的ID是一个相对于根目录的相对路径
        //index.js ./src/index.js title.js ./src/title.js
        //relative返回一个相对路径 从根目录出出到模块的绝地路径 得到一个相对路径
        module.moduleId = '.'+path.posix.sep+path.posix.relative(this.context,module.resource);
        addEntry&&addEntry(module);
        this.modules.push(module);//把模块添加到完整的模块数组中
        const afterBuild = (err,module)=>{
            if(module.dependencies){//如果一个模块编译完成,发现它有依赖的模块,那么递归编译它的依赖模块
                this.processModuleDependencies(module,(err)=>{
                    //当这个入口模块和它依赖的模块都编译完成了,才会让调用入口模块的回调
                    callback(err,module);
                });
            }else{
                callback(err,module);
            }
        }
        this.buildModule(module,afterBuild);
    }
    processModuleDependencies(module,callback){
        let dependencies= module.dependencies;
        //因为我希望可以并行的同时开始编译依赖的模块,然后等所有依赖的模块全部编译完成后才结束
        async.forEach(dependencies,(dependency,done)=>{
            let {name,context,rawRequest,resource,moduleId} = dependency;
            this.createModule({
                name,
                context,
                rawRequest,
                resource,
                moduleId,
                parser
            },null,done);
        },callback);
    }
    buildModule(module,afterBuild){
        module.build(this,(err)=>{
            this.hooks.succeedModule.call(module)
            afterBuild(null,module);
        });
    }
}
module.exports = Compilation;
```

### 6.3 webpack\Chunk.js

```js
class Chunk {
  constructor(module) {
    this.entryModule = module;
    this.name = module.name;
    this.files = [];
    this.modules = [];
  }
}

module.exports = Chunk;
```

### 6.4 Stats.js

```js
class Stats {
    constructor(compilation) {
        this.entries = compilation.entries;
        this.modules = compilation.modules;
+        this.chunks = compilation.chunks;
    }
    toJson() {
        return this;
    }
}
module.exports = Stats;
```
