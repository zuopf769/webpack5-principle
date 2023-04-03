# 优化

## 1. 提取 CSS

因为 CSS 的下载和 JS 可以并行,当一个 HTML 文件很大的时候，我们可以把 CSS 单独提取出来加载

### 1.1 安装

```shell
npm install  mini-css-extract-plugin --save-dev
```

### 1.2 webpack.config.js

```JavaScript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
+const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
+    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
+      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
+      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
+      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
       {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type:'asset/resource',
        generator:{
          filename:'images/[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
+   new MiniCssExtractPlugin({
+      filename: '[name].css'
+   })
  ]
};
```

## 2 指定图片和 CSS 目录

- filename 中可以指定输出的目录名
- `filename:'images/[hash][ext]'`；把图片输出到 images 目录下
- `'css/[name].css'`；把 css 输出到 css 目录下

### 2.1 webpack.config.js

```JavaScript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
      {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type:'asset/resource', // webpack5内置了file-loader
        generator:{
          filename:'images/[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({
+      filename: 'css/[name].css'
    }),
  ]
};
```

## 3. 压缩 JS、CSS 和 HTML

- [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin) 是一个优化和压缩 CSS 资源的插件
- [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin) 是一个优化和压缩 JS 资源的插件
- html-webpack-plugin 中可以压缩 html；移除注释，移除空格

```JavaScript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
+const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
+const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
+  mode: 'none',
  devtool: false,
  entry: './src/index.js',
+  optimization: {
+    minimize: true,
+    minimizer: [
+      new TerserPlugin(),
+    ],
+  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: { fix: true },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              '@babel/preset-env',
              {
                useBuiltIns: 'usage'
                corejs: {
                  version: 3
                },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17',
                },
              },
            ], '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
      },
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'] },
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] },
      {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type:'asset/resource',
        generator:{
          filename:'images/[hash][ext]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
    template: './src/index.html',
+     minify: {
+        collapseWhitespace: true,
+        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
+    new OptimizeCssAssetsWebpackPlugin(),
  ],
};
```

## 4. CDN

- [qiniu](https://www.qiniu.com/)
- CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度。
- [public-path](https://webpack.js.org/guides/public-path/#root)
- [external-remotes-plugin](https://npmmirror.com/package/external-remotes-plugin)

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/04/02/18-49-44-99a77dc5d2092e876e4108e65f1c999b-20230402184944-baecd8.png)

### 4.1 使用缓存

- HTML 文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的 URL 变成指向 CDN 服务器的地址
- 静态的 JavaScript、CSS、图片等文件开启 CDN 和缓存，并且文件名带上 HASH 值
- 为了并行加载不阻塞，把不同的静态资源分配到不同的 CDN 服务器上

### 4.2 域名限制

- 同一时刻针对同一个域名的资源并行请求是有限制
- 可以把这些静态资源分散到不同的 CDN 服务上去
- 多个域名后会增加域名解析时间
- 可以通过在 HTML HEAD 标签中 加入<link rel="dns-prefetch" href="http://img.zhufengpeixun.cn">去预解析域名，以降低域名解析带来的延迟

### 4.3 文件指纹

- 打包后输出的文件名和后缀
- hash 一般是结合 CDN 缓存来使用，通过 webpack 构建之后，生成对应文件名自动带上对应的 MD5 值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。

指纹占位符

| 占位符名称  | 含义                                                          |
| ----------- | ------------------------------------------------------------- |
| ext         | 资源后缀名                                                    |
| name        | 文件名称                                                      |
| path        | 文件的相对路径                                                |
| folder      | 文件所在的文件夹                                              |
| hash        | 每次 webpack 构建时生成一个唯一的 hash 值                     |
| chunkhash   | 根据 chunk 生成 hash 值，来源于同一个 chunk，则 hash 值就一样 |
| contenthash | 根据内容生成 hash 值，文件内容相同 hash 值就相同              |

#### 4.3.1 hash

Hash 是整个项目的 hash 值，其根据每次编译内容计算得到，每次编译之后都会生成新的 hash,即修改任何文件都会导致所有文件的 hash 发生改变

doc/2.js

```JavaScript
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
+  entry: {
+    main: './src/index.js',
+    vender:['lodash']
+  },
  output:{
    path:path.resolve(__dirname,'dist'),
+    filename:'[name].[hash].js'
  },
  devServer:{
    hot:false
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[hash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};
```

#### 4.3.2 chunkhash

chunkhash 采用 hash 计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即 chunkhash,chunkhash 和 hash 不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用 chunkhash 的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响

```JavaScript
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
  entry: {
    main: './src/index.js',
    vender:['lodash']
  },
  output:{
    path:path.resolve(__dirname,'dist'),
+    filename:'[name].[chunkhash].js'
  },
  devServer:{
    hot:false
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[chunkhash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};

```

#### 4.3.3 contenthash

使用 chunkhash 存在一个问题，就是当在一个 JS 文件中引入 CSS 文件，编译后它们的 hash 是相同的，而且只要 js 文件发生改变 ，关联的 css 文件 hash 也会改变,这个时候可以使用 mini-css-extract-plugin 里的 contenthash 值，保证即使 css 文件所处的模块里就算其他文件内容改变，只要 css 文件内容不变，那么不会重复构建

```JavaScript
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
  entry: {
    main: './src/index.js',
    vender:['lodash']
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].[chunkhash].js'
  },
  devServer:{
    hot:false
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[contenthash].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};
```

#### 4.3.4 hash

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/04/02/20-56-40-1bc15937e48657b3da7897992fdd4621-20230402205638-118cc2.png)

```JavaScript
function createHash(){
   return  require('crypto').createHash('md5');
}
let entry = {
    entry1:'entry1',
    entry2:'entry2'
}
let entry1 = 'require depModule1';//模块entry1
let entry2 = 'require depModule2';//模块entry2

let depModule1 = 'depModule1';//模块depModule1
let depModule2 = 'depModule2';//模块depModule2
//如果都使用hash的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效
let hash =  createHash()
.update(entry1)
.update(entry2)
.update(depModule1)
.update(depModule2)
.digest('hex');
console.log('hash',hash)
//chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。
//在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
let entry1ChunkHash = createHash()
.update(entry1)
.update(depModule1).digest('hex');;
console.log('entry1ChunkHash',entry1ChunkHash);

let entry2ChunkHash = createHash()
.update(entry2)
.update(depModule2).digest('hex');;
console.log('entry2ChunkHash',entry2ChunkHash);

let entry1File = entry1+depModule1;
let entry1ContentHash = createHash()
.update(entry1File).digest('hex');;
console.log('entry1ContentHash',entry1ContentHash);

let entry2File = entry2+depModule2;
let entry2ContentHash = createHash()
.update(entry2File).digest('hex');;
console.log('entry2ContentHash',entry2ContentHash);
```

## 5.moduleIds & chunkIds 的优化

### 5.1 概念和选项

- module: 每一个文件其实都可以看成一个 module
- chunk: webpack 打包最终生成的代码块，代码块会生成文件，一个文件对应一个 chunk
- 在 webpack5 之前，没有从 entry 打包的 chunk 文件，都会以 1、2、3...的文件命名方式输出,删除某些些文件可能会导致缓存失效
- 在生产模式下，默认启用这些功能 chunkIds: "deterministic", moduleIds: "deterministic"，此算法采用确定性的方式将短数字 ID(3 或 4 个字符)短 hash 值分配给 modules 和 chunks
- chunkId 设置为 deterministic，则 output 中 chunkFilename 里的[name]会被替换成确定性短数字 ID
- 虽然 chunkId 不变(不管值是 deterministic | natural | named)，但更改 chunk 内容，chunkhash 还是会改变的

| 可选值        | 含义                           | 示例          |
| ------------- | ------------------------------ | ------------- |
| natural       | 按使用顺序的数字 ID            | 1             |
| named         | 方便调试的高可读性 id          | src_two_js.js |
| deterministic | 根据模块名称生成简短的 hash 值 | 915           |
| size          | 根据模块大小生成的数字 id      | 0             |

### 5.2 webpack.config.js

```JavaScript
const path = require('path');
module.exports = {
    mode: 'development',
    devtool:false,
+   optimization:{
+       moduleIds:'deterministic',
+       chunkIds:'deterministic'
+   }
}
```

### 5.3 src\index.js

src\index.js

```JavaScript
import('./one');
import('./two');
import('./three');
```
