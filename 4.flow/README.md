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
- 4. 执行对象的 `run` 方法开始执行编译
- 5. 根据配置中的 `entry` 找出入口文件
- 6. 从入口文件出发,调用所有配置的 `Loader` 对模块进行编译
- 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`
- 9. 再把每个 `Chunk` 转换成一个单独的文件加入到输出列表
- 10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 `Webpack` 提供的 `API` 改变 `Webpack` 的运行结果

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/15/16-45-53-2dad0527661de1ce61da693af92fc988-20230315164552-da8e2b.png)
