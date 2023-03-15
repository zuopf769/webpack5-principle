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
