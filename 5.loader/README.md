# webpack loader原理

## 1.loader

+ 所谓 `loader` 只是一个导出为函数的 `JavaScript` 模块。它接收上一个 `loader` 产生的结果或者资源文件(`resource file`)作为入参。也可以用多个 `loader` 函数组成 `loader chain`
+ 最右侧的`loader`拿到是是资源文件，最左侧的`loader`产生`wepack`能识别的代码如`js`或者`json`
+ `compiler` 需要得到最后一个 `loader` 产生的处理结果。这个处理结果应该是 `String` 或者 `Buffer`（被转换为一个 `string`）

### 1.1 loader 运行的总体流程

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/17/09-44-45-f0f65803c9b06fccd34bd8b280e3005f-20230317094443-49cc65.png)


### 1.2 loader-runner

+ [loader-runner](https://github.com/webpack/loader-runner#readme)是一个执行 loader 链条的的模块

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/17/09-46-24-e130ce26b376a46cf06e3849fbb2fa8a-20230317094622-2e4191.png)


### 1.2.1 loader 类型

+ [loader 的叠加顺序](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L159-L339) = post(后置)+inline(内联)+normal(正常)+pre(前置)