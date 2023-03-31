const { ExternalModule } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * 需求说明：
 * 1.需要向输出html文件中添加CDN脚本引用
 * 2.在打包生产模块的时候，截断正常的打包逻辑，变成外部依赖模块
 */
class AutoExternalPlugin {
  // options是在配置文件中传过来的
  constructor(options) {
    /*
    new AutoExternalPlugin({
        jquery: {
          url: 'https://cdn.bootcss.com/jquery/3.1.0/jquery.js',
          variable:'$'
        },
        lodash: {
          url: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js',
          variable:'_'
        }
      })
    */
    this.options = options; // plugin的配置项
    this.externalModules = Object.keys(options); // ['jquery']等 进行自动外键的模块
    this.importedModules = new Set(); // 存放着所有的实际真正使用到的外部依赖模块
  }

  apply(compiler) {
    // 什么NormalModuleFactory？和compiler的关系是什么？在webpack的工作流中属于哪个环节？
    // https://webpack.docschina.org/api/normalmodulefactory-hooks/
    // Compiler 使用 NormalModuleFactory 模块生成各类模块。
    // 从入口点开始，此模块会分解每个请求，解析文件内容以查找进一步的请求，
    // 然后通过分解所有请求以及解析新的文件来爬取全部文件。
    // 在最后阶段，每个依赖项都会成为一个模块实例。
    // 生活中的例子：
    // 饭店=Compiler 招聘一个厨师 normalModuleFactory
    // 每当接到订单，顾客点个蛋炒饭，或者说创建一个模块，会由厨师normalModuleFactory创建这个模块

    // 获取到普通模块工厂,此工厂在Compiler创建的时候就直接创建好了。
    // 每种模块会对应一个模块工厂 普通模块对应的就是普通模块工厂
    compiler.hooks.normalModuleFactory.tap(
      "AutoExternalPlugin",
      (normalModuleFactory) => {
        // https://webpack.docschina.org/api/normalmodulefactory-hooks/#parser
        // 模块工厂会负责创建模块，创建完模块要编译模块，就是把模块源码转成语法树AST，然后遍历语法树找依赖
        // 在遍历语法的时候，遇到不同的点节会触发不同的事件
        normalModuleFactory.hooks.parser
          .for("javascript/auto") // HookMap
          .tap("AutoExternalPlugin", (parser) => {
            // import 语句
            // https://webpack.docschina.org/api/parser/
            // import钩子类似于ast中的node节点的type
            // https://webpack.docschina.org/api/parser/#import
            parser.hooks.import.tap(
              "AutoExternalPlugin",
              (statement, source) => {
                // source就是import的from后面的语句
                if (this.externalModules.includes(source))
                  this.importedModules.add(source);
              }
            );
            // require 语句
            //call是一个hookMap {key:Hook} 判断call这个hookMap里有没有require这个key对应的hook,如果有返回，没有则创建再返回
            parser.hooks.call
              .for("require")
              .tap("AutoExternalPlugin", (expression) => {
                const source = expression.arguments[0].value;
                if (this.externalModules.includes(source))
                  this.importedModules.add(source);
              });
          });
        // 2.改造模块的生产过程，拦截生成过程，判断如果是外部模块的话，生产一个外部模块并返回
        normalModuleFactory.hooks.factorize.tapAsync(
          "AutoExternalPlugin",
          (resolveData, callback) => {
            const { request } = resolveData; //获取加载的模块名 request = jquery
            // 如果这个要创建的模块是外部模块的话
            if (this.externalModules.includes(request)) {
              let { variable } = this.options[request];
              callback(null, new ExternalModule(variable, "window", request));
            } else {
              callback(null);
            }
          }
        );
      }
    );

    //3.向产出的html里插入CDN的脚本
    compiler.hooks.compilation.tap("AutoExternalPlugin", (compilation) => {
      /**
       * HtmlWebpackPlugin核心功能
       * 1.编译HTML模板
       * 2.根据webpack传递过来的资源信息assets,生成标签.js=>script,css=>link
       * 3.把标签注入HTML文件中
       * 4.写入硬盘 emit就是指写入硬盘
       */
      // html-webpack-plugin往compilation钩子上添加了额外的钩子，用于其他和其他插件协作沟通
      // https://github.com/jantimon/html-webpack-plugin#events
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        "AutoExternalPlugin",
        (data, callback) => {
          const { assetTags } = data;
          for (let key of this.importedModules) {
            assetTags.scripts.unshift({
              tagName: "script",
              voidTag: false,
              attributes: {
                defer: false,
                src: this.options[key].url,
              },
            });
          }
          console.log(assetTags);
          callback(null, data);
        }
      );
    });
  }
}
module.exports = AutoExternalPlugin;
/**
 * 实现思路
 * 1.找到本项目中的所有依赖的模块，看看哪些在AutoExternalPlugin配置了
 * 也就是说看看项目里有没有使用jquery和lodash
 * 因为用到了才需要处理为外部模块，如果没有用过就不需要任何处理
 * 2.如何找本项目依赖了哪些模块?
 * import 'lodash'
 * require('query'); callExpression
 * 所以我要找项目中的import和require语句，或者说节点
 * Compiler=>NormalModuleFactory=>Parser=>import/require
 */
