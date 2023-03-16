# webpack 编译流程

## 1.调试 webpack

### 1.1 通过 chrome 调试

从`node_modules/.bin/webpack`下到 webpack 的入口是`./node_modules/webpack-cli/bin/cli.js`

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/15/12-44-02-c65cdfca74a44acfb012cd70e6a33cbf-20230315124401-801d9c.png)

```shell
node --inspect-brk ./node_modules/webpack-cli/bin/cli.js
```

> 然后打开 Chrome 浏览器控制台就可以调试了

## 1.2 通过执行命令调试

- 用 vscode 打开工程目录`4.flow`，点击调试按钮，再点击小齿轮的配置按钮系统就会生成 launch.json 配置文件
- 修改好了以后直接点击 F5 就可以启动调试

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/15/12-53-23-c93417dd0c60ba9310555390cb0bc3ab-20230315125323-0c4cee.png)

.vscode\launch.json

> 用 vscode 打开 4.flow 目录

```JSON
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug webpack",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/node_modules/webpack-cli/bin/cli.js"
    }
  ]
}
```

### 1.3 debugger.js

- 把`.vscode`目录下的`launch.json`文件删掉
- 打开选中`debugger.js`文件，并在要调试的位置输入'`debugger`
- 点击`vscode`的调试按钮，点击`Run and Debug`，代码就是处于调试状态，运行到断点的地方

## 2.tapable.js

- `tapable` 是一个类似于 `Node.js` 中的 `EventEmitter` 的库，但更专注于自定义事件的触发和处理
- `webpack` 通过 `tapable` 将实现与流程解耦，所有具体实现通过插件的形式存在

```js
class SyncHook {
  constructor() {
    this.taps = []
  }
  tap(name, fn) {
    this.taps.push(fn)
  }
  call() {
    this.taps.forEach(tap => tap())
  }
}

let hook = new SyncHook()
hook.tap('some name', () => {
  console.log('some name')
})

class Plugin {
  apply() {
    hook.tap('Plugin', () => {
      console.log('Plugin ')
    })
  }
}
new Plugin().apply()
hook.call()
```

## 3. webpack 编译流程

- 1. 初始化参数：从配置文件和 `Shell` 语句中读取并合并参数,得出最终的配置对象
- 2. 用上一步得到的参数初始化 `Compiler` 对象
- 3. 加载所有配置的插件
- 4. 执行`Compiler`对象的 `run` 方法开始执行编译
- 5. 根据配置中的 `entry` 找出入口文件
- 6. 从入口文件出发，调用所有配置的 `Loader` 对模块进行编译
- 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`
- 9. 再把每个 `Chunk` 转换成一个单独的文件加入到输出列表
- 10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 `Webpack` 提供的 `API` 改变 `Webpack` 的运行结果

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/15/16-45-53-2dad0527661de1ce61da693af92fc988-20230315164552-da8e2b.png)

## 4.Stats 对象

- 在 `Webpack` 的回调函数中会得到 `stats` 对象
- 这个对象实际来自于 `Compilation.getStats()`，返回的是主要含有 `modules`、`chunks` 和 `assets` 三个属性值的对象。
- Stats 对象本质上来自于 lib/Stats.js[https://github.com/webpack/webpack/blob/v4.39.3/lib/Stats.js] 的类实例

| 字段    | 含义                   |
| ------- | ---------------------- |
| modules | 记录了所有解析后的模块 |
| chunks  | 记录了所有 chunk       |
| assets  | 记录了所有要生成的文件 |

```shell
npx webpack --profile --json > stats.json
```

```json
{
  "hash": "780231fa9b9ce4460c8a", //编译使用的 hash
  "version": "5.8.0", // 用来编译的 webpack 的版本
  "time": 83, // 编译耗时 (ms)
  "builtAt": 1606538839612, //编译的时间
  "publicPath": "auto", //资源访问路径
  "outputPath": "C:\\webpack5\\dist", //输出目录
  "assetsByChunkName": {
    //代码块和文件名的映射
    "main": ["main.js"]
  },
  "assets": [
    //资源数组
    {
      "type": "asset", //资源类型
      "name": "main.js", //文件名称
      "size": 2418, //文件大小
      "chunkNames": [
        //对应的代码块名称
        "main"
      ],
      "chunkIdHints": [],
      "auxiliaryChunkNames": [],
      "auxiliaryChunkIdHints": [],
      "emitted": false,
      "comparedForEmit": true,
      "cached": false,
      "info": {
        "javascriptModule": false,
        "size": 2418
      },
      "related": {},
      "chunks": ["main"],
      "auxiliaryChunks": [],
      "isOverSizeLimit": false
    }
  ],
  "chunks": [
    //代码块数组
    {
      "rendered": true,
      "initial": true,
      "entry": true,
      "recorded": false,
      "size": 80,
      "sizes": {
        "javascript": 80
      },
      "names": ["main"],
      "idHints": [],
      "runtime": ["main"],
      "files": ["main.js"],
      "auxiliaryFiles": [],
      "hash": "d25ad7a8144077f69783",
      "childrenByOrder": {},
      "id": "main",
      "siblings": [],
      "parents": [],
      "children": [],
      "modules": [
        {
          "type": "module",
          "moduleType": "javascript/auto",
          "identifier": "C:\\webpack5\\src\\index.js",
          "name": "./src/index.js",
          "nameForCondition": "C:\\webpack5\\src\\index.js",
          "index": 0,
          "preOrderIndex": 0,
          "index2": 1,
          "postOrderIndex": 1,
          "size": 55,
          "sizes": {
            "javascript": 55
          },
          "cacheable": true,
          "built": true,
          "codeGenerated": true,
          "cached": false,
          "optional": false,
          "orphan": false,
          "dependent": false,
          "issuer": null,
          "issuerName": null,
          "issuerPath": null,
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "profile": {
            "total": 38,
            "resolving": 26,
            "restoring": 0,
            "building": 12,
            "integration": 0,
            "storing": 0,
            "additionalResolving": 0,
            "additionalIntegration": 0,
            "factory": 26,
            "dependencies": 0
          },
          "id": "./src/index.js",
          "issuerId": null,
          "chunks": ["main"],
          "assets": [],
          "reasons": [
            {
              "moduleIdentifier": null,
              "module": null,
              "moduleName": null,
              "resolvedModuleIdentifier": null,
              "resolvedModule": null,
              "type": "entry",
              "active": true,
              "explanation": "",
              "userRequest": "./src/index.js",
              "loc": "main",
              "moduleId": null,
              "resolvedModuleId": null
            }
          ],
          "usedExports": null,
          "providedExports": null,
          "optimizationBailout": [],
          "depth": 0
        },
        {
          "type": "module",
          "moduleType": "javascript/auto",
          "identifier": "C:\\webpack5\\src\\title.js",
          "name": "./src/title.js",
          "nameForCondition": "C:\\webpack5\\src\\title.js",
          "index": 1,
          "preOrderIndex": 1,
          "index2": 0,
          "postOrderIndex": 0,
          "size": 25,
          "sizes": {
            "javascript": 25
          },
          "cacheable": true,
          "built": true,
          "codeGenerated": true,
          "cached": false,
          "optional": false,
          "orphan": false,
          "dependent": true,
          "issuer": "C:\\webpack5\\src\\index.js",
          "issuerName": "./src/index.js",
          "issuerPath": [
            {
              "identifier": "C:\\webpack5\\src\\index.js",
              "name": "./src/index.js",
              "profile": {
                "total": 38,
                "resolving": 26,
                "restoring": 0,
                "building": 12,
                "integration": 0,
                "storing": 0,
                "additionalResolving": 0,
                "additionalIntegration": 0,
                "factory": 26,
                "dependencies": 0
              },
              "id": "./src/index.js"
            }
          ],
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "profile": {
            "total": 0,
            "resolving": 0,
            "restoring": 0,
            "building": 0,
            "integration": 0,
            "storing": 0,
            "additionalResolving": 0,
            "additionalIntegration": 0,
            "factory": 0,
            "dependencies": 0
          },
          "id": "./src/title.js",
          "issuerId": "./src/index.js",
          "chunks": ["main"],
          "assets": [],
          "reasons": [
            {
              "moduleIdentifier": "C:\\webpack5\\src\\index.js",
              "module": "./src/index.js",
              "moduleName": "./src/index.js",
              "resolvedModuleIdentifier": "C:\\webpack5\\src\\index.js",
              "resolvedModule": "./src/index.js",
              "type": "cjs require",
              "active": true,
              "explanation": "",
              "userRequest": "./title.js",
              "loc": "1:12-33",
              "moduleId": "./src/index.js",
              "resolvedModuleId": "./src/index.js"
            },
            {
              "moduleIdentifier": "C:\\webpack5\\src\\title.js",
              "module": "./src/title.js",
              "moduleName": "./src/title.js",
              "resolvedModuleIdentifier": "C:\\webpack5\\src\\title.js",
              "resolvedModule": "./src/title.js",
              "type": "cjs self exports reference",
              "active": true,
              "explanation": "",
              "userRequest": null,
              "loc": "1:0-14",
              "moduleId": "./src/title.js",
              "resolvedModuleId": "./src/title.js"
            }
          ],
          "usedExports": null,
          "providedExports": null,
          "optimizationBailout": ["CommonJS bailout: module.exports is used directly at 1:0-14"],
          "depth": 1
        }
      ],
      "origins": [
        {
          "module": "",
          "moduleIdentifier": "",
          "moduleName": "",
          "loc": "main",
          "request": "./src/index.js"
        }
      ]
    }
  ],
  "modules": [
    //模块数组
    {
      "type": "module",
      "moduleType": "javascript/auto",
      "identifier": "C:\\webpack5\\src\\index.js",
      "name": "./src/index.js",
      "nameForCondition": "C:\\webpack5\\src\\index.js",
      "index": 0,
      "preOrderIndex": 0,
      "index2": 1,
      "postOrderIndex": 1,
      "size": 55,
      "sizes": {
        "javascript": 55
      },
      "cacheable": true,
      "built": true,
      "codeGenerated": true,
      "cached": false,
      "optional": false,
      "orphan": false,
      "issuer": null,
      "issuerName": null,
      "issuerPath": null,
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "profile": {
        "total": 38,
        "resolving": 26,
        "restoring": 0,
        "building": 12,
        "integration": 0,
        "storing": 0,
        "additionalResolving": 0,
        "additionalIntegration": 0,
        "factory": 26,
        "dependencies": 0
      },
      "id": "./src/index.js",
      "issuerId": null,
      "chunks": ["main"],
      "assets": [],
      "reasons": [
        {
          "moduleIdentifier": null,
          "module": null,
          "moduleName": null,
          "resolvedModuleIdentifier": null,
          "resolvedModule": null,
          "type": "entry",
          "active": true,
          "explanation": "",
          "userRequest": "./src/index.js",
          "loc": "main",
          "moduleId": null,
          "resolvedModuleId": null
        }
      ],
      "usedExports": null,
      "providedExports": null,
      "optimizationBailout": [],
      "depth": 0
    },
    {
      "type": "module",
      "moduleType": "javascript/auto",
      "identifier": "C:\\webpack5\\src\\title.js",
      "name": "./src/title.js",
      "nameForCondition": "C:\\webpack5\\src\\title.js",
      "index": 1,
      "preOrderIndex": 1,
      "index2": 0,
      "postOrderIndex": 0,
      "size": 25,
      "sizes": {
        "javascript": 25
      },
      "cacheable": true,
      "built": true,
      "codeGenerated": true,
      "cached": false,
      "optional": false,
      "orphan": false,
      "issuer": "C:\\webpack5\\src\\index.js",
      "issuerName": "./src/index.js",
      "issuerPath": [
        {
          "identifier": "C:\\webpack5\\src\\index.js",
          "name": "./src/index.js",
          "profile": {
            "total": 38,
            "resolving": 26,
            "restoring": 0,
            "building": 12,
            "integration": 0,
            "storing": 0,
            "additionalResolving": 0,
            "additionalIntegration": 0,
            "factory": 26,
            "dependencies": 0
          },
          "id": "./src/index.js"
        }
      ],
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "profile": {
        "total": 0,
        "resolving": 0,
        "restoring": 0,
        "building": 0,
        "integration": 0,
        "storing": 0,
        "additionalResolving": 0,
        "additionalIntegration": 0,
        "factory": 0,
        "dependencies": 0
      },
      "id": "./src/title.js",
      "issuerId": "./src/index.js",
      "chunks": ["main"],
      "assets": [],
      "reasons": [
        {
          "moduleIdentifier": "C:\\webpack5\\src\\index.js",
          "module": "./src/index.js",
          "moduleName": "./src/index.js",
          "resolvedModuleIdentifier": "C:\\webpack5\\src\\index.js",
          "resolvedModule": "./src/index.js",
          "type": "cjs require",
          "active": true,
          "explanation": "",
          "userRequest": "./title.js",
          "loc": "1:12-33",
          "moduleId": "./src/index.js",
          "resolvedModuleId": "./src/index.js"
        },
        {
          "moduleIdentifier": "C:\\webpack5\\src\\title.js",
          "module": "./src/title.js",
          "moduleName": "./src/title.js",
          "resolvedModuleIdentifier": "C:\\webpack5\\src\\title.js",
          "resolvedModule": "./src/title.js",
          "type": "cjs self exports reference",
          "active": true,
          "explanation": "",
          "userRequest": null,
          "loc": "1:0-14",
          "moduleId": "./src/title.js",
          "resolvedModuleId": "./src/title.js"
        }
      ],
      "usedExports": null,
      "providedExports": null,
      "optimizationBailout": ["CommonJS bailout: module.exports is used directly at 1:0-14"],
      "depth": 1
    }
  ],
  "entrypoints": {
    //入口点
    "main": {
      "name": "main",
      "chunks": ["main"],
      "assets": [
        {
          "name": "main.js",
          "size": 2418
        }
      ],
      "filteredAssets": 0,
      "assetsSize": 2418,
      "auxiliaryAssets": [],
      "filteredAuxiliaryAssets": 0,
      "auxiliaryAssetsSize": 0,
      "children": {},
      "childAssets": {},
      "isOverSizeLimit": false
    }
  },
  "namedChunkGroups": {
    //命名代码块组
    "main": {
      "name": "main",
      "chunks": ["main"],
      "assets": [
        {
          "name": "main.js",
          "size": 2418
        }
      ],
      "filteredAssets": 0,
      "assetsSize": 2418,
      "auxiliaryAssets": [],
      "filteredAuxiliaryAssets": 0,
      "auxiliaryAssetsSize": 0,
      "children": {},
      "childAssets": {},
      "isOverSizeLimit": false
    }
  },
  "errors": [],
  "errorsCount": 0,
  "warnings": [],
  "warningsCount": 0,
  "children": []
}
```
