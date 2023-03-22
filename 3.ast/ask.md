丁浩宇
还有在模块内，为什么我使用process.env.NODE_ENV不报错，而使用process.env.username，就报process not defined 

process.env.NODE_ENV只是一个字符串，在编译阶段会经过字符串的替换，
替换同成development或者production

process.env.username
在浏览里并没有process这样的对象

陈柳鹏
忘记开默认静音了？ 
北极那企鹅丶
process是node里面的 



北源
我们源码不是声明了一个字符串吗 怎么编译以后成了声明函数了 
能
ast语法树一个标准吗？babel和别人实现的一样吗 
是的
能
转换出来的ast语法树和别家的结构一样吗 
水星
types是辅助库吗?感觉老师用types很多的 、
是的

陈柳鹏
types 是类型依赖好像 d.ts? 
不依赖
这里的types和d.ts没有任何关系
水星
会出现住多个人的情况吗? 
不会
丁浩宇
好像都是jquery的方法 


20:30
好大鸭
vscode 写代码是不是一直在匹配ast 
北源
怎么区分 var str = "function a(){}" 和 function b (){}啊 
20:34
黑子
为什么 是 源代码是字符串呀 
北源
似乎明白了  sourceCode变量 就是文件内容 所以是字符串  
黑子
1 
今天有风
把type改了 是不是就行了 
好大鸭
this呢 
能
visitor是不是bable提供的方法，es还得自己遍历判断？ 
visitor是一个属性，在 babel内部会生成语法树，还会遍历语法树，还会应用我们的给它提供的visitor
shine
babel就是提供语法转换，且遍历 
wind-zhou
谁会消费这个语法树呀？ 访问器也就是插件来消费
丁浩宇
types.isBlockStatement(body)应该是node.body吧 





水星
这里判断必须取反吗?不能直接指定类型吗? 
建文
回答：怎么区分，一个是函数定义，一个是函数声明 
定义一个函数
可以用函数声明，也可以用函数表达式
function ast(){}
let ast = function(){}
丁浩宇
可以在讲一下visitor的概念吗 
访问器
崔
(a,b)=>{return a+b}  这个转了以后会加两个return吗 
好大鸭
箭头函数在创建的时候已经确定this了 
20:51
好大鸭
根节点在不同环境是不一样的，怎么处理 
今天有风
找到根节点 是类似根据作用域来找吗
节点路径之间的关系
和作用域的上下级关系没有必然联系 
好大鸭
外层函数还有可能bind其他this 


function a(){ 
  var b = 1;
  function c(){
    var f = 2;
    let g = {
       h:()=>{

       }
    }
  }
}

let obj = {
  a:{
    b:{
      c:{
        d:'zhufeng'
      }
    }
  }
}


为什么 29 行是 path.isArrowFunction 
丁浩宇
嵌套的箭头函数里面调用this是怎么递归解析的 
今天有风
那假如和函数c平级的函数  会用到吗 
333
function a(){

}
function b(){

}

21:05
没离开过
那应该是 parent.isArrowFunction 吧 
能
这些方法，都是babla提供的吧 是的
好大鸭
想看看let/const 的局部作用域是怎么实现的 
这个会在后面我们手写rollup的时候实现
能
esprima没有这些方法 



黑子撤回了一条消息
难忘记nice
state吧 
能
state没听懂 
黑子
这个怎么在项目里面应用呀,比如说我现在做的react项目,怎么能用上呀, 最好改变一下 打印的字体颜色,这个是不是要用color的库 
babel-loader
plugins:['']
陈柳鹏
这个怎么用在项目中？ 
黑子
这个是 第二行么? 
难忘记nice
babelrc里面用就行了 
好大鸭
cwd是个绝对路径 


访问器之间传递的状态值 用来记载一些标识之类的 
李然
怎么能发布到vscode 里面 
npm




21:32
lesson
怎么有种中间件的感觉 
丁浩宇
不能写成类的形式，里面有一个visitor方法吗 
21:37
李然
有点像cocos的写法 
能
如果引入了，不应该什么都不做吗？ 是的
黑子
获取 loggerId 跟写了 多个 import 引入 没有关系吧 
丁浩宇
importedModuleName不是应该是一个数组吗？毕竟import倒入可以有多条 
李然
引入logger 的作用是什么 
陈柳鹏
这名字真长。。 
好大鸭
我已经眩晕了 
陈柳鹏
好像只是为了标识他有没有引入。。 
好大鸭
不管他有没有引入，再引入一遍 
如果没有引入，就引入，如果引入了，直接用已经引入的
對不起...
怎么确定是默认导入？也可能是其他导入情况 
陈柳鹏
可能有其他导入方式呢。。 
好大鸭
只用 logger 
李杰
logger比console.log好用吗 
xxxx
templete  哪里来的 
没离开过
types 和 template 都能创建节点吗，有什么区别 
黑子
引入的 
难忘记nice
template可以直接根据代码生成ast 
21:53
sunShine
43行为啥可以这样写"fun|da"这样 
因为babel支持这种写法



这个class里面的logger怎么添加进去的 
刘磊
老师加点注释吧 
黑子
老师,时间允许,可以演示一下在 项目中 babel添加 自己写的插件么? pulgin中添加 函数就可以 , 简单说一下就行, 还有 logger 怎么能在调用的时候 添加 参数区别不通地方调用呢 
丁浩宇
visitor里面怎么多了Program属性 
陈柳鹏
黑子+1 
21:59
林小牛
埋点是干啥用？ 
陈柳鹏
数据分析 监控错误 之类的。。 
建文
老师，有个额外的问题，这样会把所有的函数添加logger，
如何才能指定用户点击的那个绑定的方法添加logger，自定义的函数不需要添加 
丁浩宇
traverse内部是不是有循环遍历了 
是的

21-23 的方法调用是怎么找到的 
Tony
根据方法名 

有了白名单是不是就不用写黑名单了，这两个互斥 




命名空间导入是什么意思 
黑子
命名空间导入是什么意思  ///  * as defalut 
對不起...
自己实现插件的一般步骤是啥？能总结下吗 
张仁阳

导出
export a =1
export b =2;

导入
import * as xx from '导出'
xx.a
xx.b

步骤是固定
1.看看老的语法树
2.看看新的语法树
3.看看它们之间的差异
缺啥补啥，多啥删啥



20:05
123
memberexpress 
20:10
丁浩宇
file是固定名称吗 是
123
感觉这个errors 像Set 
陈柳鹏
这是什么？ 


好大鸭
栈的深度是什么意思 
sunShine
像这个stackTraceLimt这个属性上哪里查去啊 
陈柳鹏
同问。。 
好大鸭
为啥设置了下面的错误就没了 
sunShine
太长了，根本记不住 
sunShine
要是没见过，还不知道有这个属性 


lesson
之前好像有个 progress 
上面一层是不是也有 file? 
难忘记nice
如果这样要怎么处理 
难忘记nice
  
会议用户619087
为什么加了stacktree就不报错了啊 
丁浩宇
Error就是node的内置错误对象吧 
jialingling
这几个属性分别对应代码的哪些部分 
jialingling
  





执行语句 
难忘记nice
当前作用域下的变量集合 是的
会议用户619087
老师是在怎么记住node下所有属性的。又有什么好的方法吗 
不需要记

20:33
123
没变短 
shine
老师这个短是怎么定义的？有一些是 a b c这样的 是不是更节省存储? 

会议用户619087
ast中 父子节点，或者同层次节点 是根据分号分割的吗还是\n 



对象的key值也可以吗 
难忘记nice
是根据语义分割的吧。比如promise可以隔行then之类的 
李然
相当于uuid 
sfdsfds
temp1
temp2
temp3



压缩插件。。。 
lesson
三行 一个压缩 插件 哈哈 
陈柳鹏
webpack不是 把那些名字都变短了。什么r 什么d 
并不是
webpack里那个变量名r d在源码里就是这么写的，并不是经过 webpack处理成这样的
20:43
123
路径查找 
123
如果名字和路径不对应呢 
lesson
那如果 别人的 包 没有这么有条理呢？ 不能用
丁浩宇
local里面的extra是什么意思 
黑子
loader的 pulgin的执行时机是什么呀,打包的时候执行么?还是一直都在监听执行呀 
马上讲

能
为什么用别人的组件库的时候没有这样配，也能按需引入呢 
黑子
你怎么用的呀 
能撤回了一条消息
能
import { Button, message } from 'ant-design-vue';直接这样就行，不用配置 


@babel/types 两个作用
1.判断某个节点是不是某个类型
2.快速通过工厂方法创建节点实例



import { Button, message } from 'ant-design-vue';直接这样就行，不用配置 
123
不是不能用而是找不到吧，不然会包很多错吧 
123
其实react-window 也是和lodash 一样的导出方式 
能
不支持react？react也可以解构按需引入把  不行
什么时候才可以有按需导入
一般只适用一些方法库和组件库

123
4行的也可以拿进去 
21:01
能
为什么xxx/xx啊这样就可以引用到呢 
李然
@babel/types 的作用是什么 
能
这个和摇树的功能什么区别呢 
后面马上会讲rollup


antd 
123
react-window 也可以按需导入 
Tony
vue有按需导入的插件 
jialingling
多次引入同个插件，打包的时候是不是也会打包多次代码？ 
不会的
在一个项目占，相同的模块引入多次的话只会打包一次




123
vite 就没有babelrc 这个文件了？ 
shine
那个是作者后面拆成了2个包 所以。。。 
123
去代码看导入方式和导出方式是一样的 
能
那{useStart} from ’react‘ 这样不是按需引入马 
肯定不是的

123
这些有的能用有的不能用 
李然
import {mapState，mapAction} from "vuex” 为啥可以这么引 
123撤回了一条消息
123
看 useStart 是不是独立文件 



老师 像ahooks这样  是不是就自己实现了按需导入了？ 
shine
他是区分成多个hooks文件的 
Tony
unplugin-auto-import 



咋的在react的原型上添加方法、  比如vue中Vue.prototype.$echarts = echarts这样 。想在react中用 echarts，每个组件用到 echarts都要引入一遍吗？ 
我们无法像vue一样， 我们可以使用一些插件或者配置自动向模块中注入echarts
Provide

Tailwind CSS是什么? 

