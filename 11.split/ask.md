## import,和创建 srcpit 标签一样吗

import 是一个 JS 语法
webpack 在打包编译的时候，如果遇到 import 语法
会反它转换成 require.e,require.e 是通过动态创建 script 标签实现的
