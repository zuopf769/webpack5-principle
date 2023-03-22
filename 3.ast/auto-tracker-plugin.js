const core = require('@babel/core');
const types = require('@babel/types');
const template = require('@babel/template');
const importModule = require('@babel/helper-module-imports');
/**
 * 实现此插件需要二步
 * 1.判断是否源代码里已经引入了logger模块，如果引入了直接用，如果没有引入要手工引入
 * 2.找到代码中所有的函数，向里面插件调用logger方法
 */
const autoTrackerPlugin = (options) => {
  return {
    visitor: {
      Program: {
        enter(path,state) {
          let loggerId;
          path.traverse({
            ImportDeclaration(path) {//此方法会进入多次
              const importedModuleName = path.get('source').node.value;
              if (importedModuleName === options.name) {
                //老师 那个 .0是不是跟写多少个import 没有关系呀
                const specifierPath = path.get('specifiers.0');
                if (specifierPath.isImportDefaultSpecifier()//默认导入
                  || specifierPath.isImportSpecifier()//普通导入
                 ||specifierPath.ImportNamespaceSpecifier()) {//命名空间导入
                  loggerId = specifierPath.node.local.name;
                }
                path.stop();//不再遍历了，跳过后续的所有的查找和遍历
              }
            }
          });
          //如果loggerId在遍历完了以后还是undefined
          if (!loggerId) {
            //  import xx from 'logger'
            loggerId = importModule.addDefault(path, options.name, {
              nameHint:path.scope.generateUid(options.name)
            });
          }
          //ejs 模板引擎 返回的是一个语法树的节点
          state.loggerNode = template.statement(`LOGGER();`)({
            LOGGER:loggerId
          });
        }
      },
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(path,state) {
        const { node } = path;
        if (node.id&&options.whiteLists.includes(node.id.name)) {
          ///如果它的body已经是一个语句块了，直接在块的开始添加方法调用即可
        if (types.isBlockStatement(node.body)) {
          node.body.body.unshift(state.loggerNode);
        } else {
          const newNode = types.blockStatement([
            state.loggerNode,
            types.expressionStatement(node.body)
          ]);
          path.get('body').replaceWith(newNode);
        }
        }
      }
    }
  }
}
module.exports = autoTrackerPlugin;