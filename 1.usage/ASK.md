09:36
好大鸭
webpack 和webpack-cli 什么区别呢 
webpack是打包的核心包
cli是命令行工具我
赵文明
多入口和多出口怎么配了 
09:45
咚哩个咚
所以loader最少得两个是么 
能
不是不是 
sunShine
这种webpack应该可以配置没有压缩的来进行调试吧 
后知后觉后想念
老师，最左侧的loader一定会返回一个js模块是什么意思？ 
钟畅
webpack4 5有啥变化 
11
如果我要指定开发环境 还需要压缩该咋办 
happy撤回了一条消息
好大鸭
json不认识吗？ 
好大鸭
图片怎么处理呢 
赵文明
xml 和 yum 也能识别吧 
yaml
null
太强了， 能力既是生产了 
null
生产力 
嘻嘻
太强了 
11
老师如果我要指定开发环境 还需要压缩该咋办 
lesson
装个压缩插件呗 
TerserPlugin
11
webpack 好像只有 mode = production 才会压缩 
如果mode=production
自己内部会自动启动压缩插件 js css html
能
一个是node的变量，一个是webpack的环境变量 

一个是node变量


10:03
刘磊
Defineplugin 是设置到window上了吗？ 
不是的。Defineplugin只是设置一些key value.用于模块打包的时候对源码进行替换
它并不是定了一个变量，跟window和global全局变量都没关系 

刘磊
能修改Defineplugin设置的变量不 



通过环境变量文件设置效果和cross-env效果一样么 
Anne
世纪项目中是否应该有一个配置环境变量是： 生产环境、开发环境、测试环境的地方？或者文件 
en

Anne撤回了一条消息
何以时光陌
env文件 
Anne
实际项目 
好大鸭
只要webpack一个包也可以打包吧 
好大鸭
不需要命令行工具 
后知后觉后想念
老师 style loader 不是把打包中的样式js 转换后插入html中吗？ 
是的，我们后会手写 style-loader
谷新磊
webpack配置替换key：value有啥作用？ 
jialingling
是不是在vue项目里面也能直接取到age哈 只要在源码中都可以取到


3557
.env 
陈柳鹏
编译替换吧，不是挂载吧？ 只是编译时的字符串替换，并不是挂载到任何对象上去 replace
177****1991
.env.production? 
Cara
env怎么添加自定义参数 




老师会讲webpakc配置gzip压缩吗？之前在用webpack-theme-color-replacer插件的时候发现配置了gzip压缩后，该插件注册在windows上的变量就找不到了 
vc
配置cross-env 还用设置DefinePlugin 他们的关系是怎样的? 
其实可以没关系
但是我们可以通过
'process.env.NODE_ENV': process.env.NODE_ENV,
能
vue-cli中的env文件也是这样定义的把 
vue-cli create-react-app都是这么做的

何以时光陌
对 




开发和生产环境不一样的name和key怎么取 
何以时光陌
定义不同的env文件 
|- config.default.js
|- config.prod.js
|- config.unittest.js
`- config.local.js

好大鸭
cross-env 是node变量，所有文件都可以获取 是的
难忘记nice
vue-cli的配置就是dot-env+definePlugin吗 
北极那企鹅丶
一个是node执行时临时环境变量，
一个是代码在浏览器运行时被替换的字符串 
这个替换是在打包编译的时候替换的，在浏览运行的时候不会替换了
11
两个不一样，那 js 代码里会替换成哪个 
DefinePlugin
北


肯定是definePlugin了 
爱吃橘子
老师，不在脚本里配cross.env,可以在config.js里配置环境变量吗 
赵文明
通过 definedPlugin 加webpack-merge 也能实现 
177****1991
vue-cli-service build --mode production 能获取到.env.production中自定义的 环境变量 原理是啥样的啊（process.env可以拿到对应的配置） 


后知后觉后想念
老师  webpack的底层是nodejs  所以webpack运行时使用v8引擎运行的吗？ 运行的是node的环境？ 
是的
水星
明白了 
123
休息下吧 

webpack-dev-server
1.用webpack打包项目，得到输出的文件，放到输出目录里，
webpack-dev-server打包的话，结果文件并不会写入硬盘，只会写到内存里。
2.启动http服务器，用来返回打包后的文件
http服务器的静态文件根目录有两个
1.打包后的dist目录
2.我们指定的静态文件根目录 public目录 




wind-zhou
相当于启动的express 服务器托管了静态文件？ 
原理就是启动了express服务器，托管了二个静态文件根目录
10:59
奈斯啊小刘超奈斯
sass
node-sass
dart-sass
node-sass  是 scss 用的,好多人都不让我用 node-sass,怎么能代替他呢 
dart-sass
奈斯啊小刘超奈斯
不用这个,可以用什么呀 
陈柳鹏
sass 
陈柳鹏
之前叫dart-sass 
好大鸭
为啥不让 
陈柳鹏
安装困难。 
177****1991
是不是每次下载不下来 
奈斯啊小刘超奈斯
有这个问题 
177****1991
设置个nmprc 
Bury
node-sass确实有一些兼容问题 需要跟node版本匹配 
奈斯啊小刘超奈斯
关键是node-sass,让替换掉,换别的包忘记了叫什么了 
177****1991
设置到私有库 或者淘宝镜像 很快的 
陈柳鹏
就叫sass 
陈柳鹏
"sass":"版本" 
李杰
scss感觉要强大 
李杰
可以循环 函数都可以用 
好大鸭
scss 和 sass 分不清楚 
123
可以前面不要配置css-loader 和style-loader 因为第一个配置了 
奈斯啊小刘超奈斯
不可以吧 



奈斯啊小刘超奈斯撤回了一条消息
丁浩宇
postcss-loader和其他loader有没有顺序 
当然有了
它是处理css,直接处理原始的css
奈斯啊小刘超奈斯
有的 
奈斯啊小刘超奈斯
必须这个顺序 
好大鸭
postcss能不能写在cssloader后面 
丁浩宇
postcss.config.js和.postcssrc推荐使用那个 
123
这个browserslist 只有webpack 支持吧，vite 不支持吧 



webpack4.0 webpack5.0
对静态文件的处理不一样
4 处理图片 
file-loader 读取源图片，拷贝并重命名输出到目标目录下，然后返回新的名称
url-loader 可以把静态文件变成base64字符串，进行返回，可以直接内嵌到HTML里

v5之后
这二个loader的都废弃了



happy撤回了一条消息
后知后觉后想念
老师 为什么 webapck的配置 写在配置文件里也可以 写在package.json里也可以？ 

因为内部会去读对应的位置的配置

happy
browerlist和postcss.config.js都配置了 ，哪个优先呢 
优先级是有原则 
离用户越近的，优先有越高
11:18
能
这样做有什么好处呢？小图片都不会转化base64了 
图片小的话转成base64进行内联可以节约http请求数
图片大的转成base64会加大html文件体积，增加下载html的时间不划算了
奈斯啊小刘超奈斯
svg属于哪个? url-load么 
你自己看着办
赵文明
图片的导入什么时候用import  require 
奈斯啊小刘超奈斯
webpack都可以,我记得这个要配置一下package,vite只可以使用import 
vite 依赖es module 按理说不支持commonjs
奈斯啊小刘超奈斯
现在区分环境配置也要用 merge那个包么? 

webpack-merge 可以用来合并不同的环境下的配置文件



这个type的值是固定的？？ 是的
奈斯啊小刘超奈斯
固定什么意思 
晚风
怎么理解离用户越近呢 老师 
https://github.com/browserslist/browserslist#readme
丁浩宇
图片大小多少属于临界值 自己定 8K
丁浩宇
多大的使用内连比较好 
能
图片转化base64之前也可以指定大小，理解不了他这个废弃url-load的动机是什么 
能
或者说，url-load有什么问题 
麻烦 ，需要单独安装loader,单独配置




inline resource 什么区别 
奈斯啊小刘超奈斯
一个是原文件引入返回地址,一个返回base64字符串 是的
sunShine
那我怎么让这些图之类的静态文件打包进dist中的asset这个文件夹 
在webpack里，所有的输出路径，也可以指定输出的目录
奈斯啊小刘超奈斯
有配置应该也是 output 
张仁阳


webpack
babel-loader
@babel/core
@babel/preset-env
@babel/preset-react
@babel/plugin-proposal-decorators
@babel/plugin-proposal-private-property-in-object
@babel/plugin-proposal-private-methods
@babel/plugin-proposal-class-properties



11:36
好大鸭
一张png图片，默认配饰的是recourse,我想让他小于8k转base64 

 {
        test: /\.png$/,//会把txt内容直接返回
        type: 'asset',//表示可以根据实际情况进行自选择是resource还inline
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024//如果文件大小小于8K就走inline,如果大于8K就
          }
        }
      }

123
query 是啥？ 
Mob
现在是内置clean-webpack-plugin了？
没有内置 
李杰
都这么多年了，浏览器为啥还需要转es5 
奈斯啊小刘超奈斯
兜底 
11:44
lesson
早package 中配置 babel 和 babelrc 中配 会同时执行吗 
package.json中的优先级会高一些
丁浩宇
那要是不传参的话，能不能把二维数组变成一维数组 可以 


11:52
123
感觉这个leacy 和loose 没什么用 
leacy是true还是false会决定你以何种方式使用装饰器 @dec class P  class @dec P
奈斯啊小刘超奈斯
同学们我们上午几点呀 12点
钟畅
最终打包预设的集合是只打包使用到的插件嘛 

打包的过程会使用到插件，而插件是在预置里配置的


英剑คิดถึง
12 
奈斯啊小刘超奈斯
clean-webpack-plugin 不是有一个配置clear:true不是就可以了么 
何以时光陌
现在图片转base64要自己配置嘛 



我还是习惯老的方式使用装饰器 
隽
.dev .prod这两个文件怎么读取的啊，没有听到，可以讲一下吗 
隽
  
123
装 dotenv 
钟畅
是只打包出用到的转义插件 没用到不会被打包进来 


mobx5是使用的装饰器，但是mobx6.0已经废弃了



不理解为啥 corss-env 设置的 NODE_ENV 在vite。
config 中的procss.env。NODE_ENV  拿不到 
陈柳鹏


老师，前面设置打包输出文件那里没听清楚，是不是设置了输出目录，
然后所有的依赖都打包到那个目录了是吧?
是的
我们实际项目里面也可以配按资源类型输出到指定文件夹是吧



以前用的是clean-webpack-plugin 
奈斯啊小刘超奈斯
clean在mac下不能使用,不然热更新会失败,之前的bug,现在不清楚修复没有 
14:17
奈斯啊小刘超奈斯撤回了一条消息
追风筝的人
eslint airbnb 和 standard有什么区别啊 
奈斯啊小刘超奈斯
继承的规则可以去npm查看么? 
wind-zhou

eslint首先需要一个配置文件
如果你想在vscode看到红色的波浪线，需要安装vscode插件
如果你想在打包的时候的时候报错，需要使用eslint-loader,报错了会阻止继续编译打包

eslint 只有安装了插件才会再有语法错误时阻止编译吗？ 
奈斯啊小刘超奈斯
写了ts-loader还用写 babel-loader么 
ts-loader性能太差，而且尽量别用了babel-loader
追风筝的人
—fix应该就可以修复吧 
123
关闭vscode 
奈斯啊小刘超奈斯撤回了一条消息
123
npm run serve 



直接ctrol s 
123
control 
会议用户619087
git提交代码校验是不是也是eslint 
哈士奇 husky 
奈斯啊小刘超奈斯
那个不是eslint 
丁浩宇
webpack是怎么停止打包的 





就是说 eslintrc.js 只是给 插件来读取的，编译的时候靠的是loader的能力？ 
不是仅仅给插件

编译时候，会走eslint-loader,eslint 内部会使用eslint这个核心包，这个核心包工作的时候
需要读取用户配置的eslintrc.js


难忘记nice
之前有个命令行包，在mac上没法用，就是因为LF 和 CRLF 
难忘记nice
这种有什么解决办法吗 
奈斯啊小刘超奈斯
没看出来两个换行有什么区别呀 不可见字符
说滴对！
mock是不是基于这个是proxy的 原理是类似 可以通过proxy支持mock功能

14:32
袖珍汤锅
可以代理到 https 的网址下吗？ 


jialingling
设置了代理就不会有跨域问题嘛?之前好像遇到过有的后台接口会报跨域 
是的
奈斯啊小刘超奈斯
老师,在二级路由情况下就不行了
比如说 /api 可以被转换
/home/api就不可以了,因为跳转到别的路由了
/home/name/api  还有这种
这样代理该怎么配置呀
umi可能就被改过了,就不会有这种问题 
lesson
我们这边用的 是浏览器代理插件 switch 
wind-zhou
像Beautify，Prettier 这些代码格式化的插件 是按照什么风格进行格式化的？
  
5255
还有一种情况是 /home  路由里面也是home开头，刷新的时候就会走接口，精准匹配也不行 


亚蒙
代理和中间件能共用吗 
proxy
奈斯啊小刘超奈斯
老师新项目推荐 umi还是 vite 

