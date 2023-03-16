1.多入口和多出口怎么配？
2.这种webpack应该可以配置没有压缩的来进行调试吧 
对于开发环境，我们可以自己手工配置压缩插件
js TerserPlugin css 
,webpack优化的时候讲
3.图片怎么处理呢?
4.老师会讲webpakc配置gzip压缩吗？之前在用webpack-theme-color-replacer插件的时候发现配置了gzip压缩后，该插件注册在windows上的变量就找不到了 
会在后面webpack优化的时候讲
4.那我怎么让这些图之类的静态文件打包进dist中的asset这个文件夹 



在4.0以前
webpack 负责打包webpack
webpack-dev-server负责启动webpack服务器  webpack-dev-server
4.0以后
webpack-cli
webpack => webpack
webpack serve => webpack-dev-server