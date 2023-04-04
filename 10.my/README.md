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
