const types = require('@babel/types');
const visitor = {
  ImportDeclaration(path,state) {
    const { node } = path;
    const { libraryName, libraryDirectory } = state.opts;
    //如果说此节点导入的包名和配置的按需加载包名是一样的，并且不是默认导入的话
    if (libraryName === node.source.value &&
      !types.isImportDefaultSpecifier(specifiers[0])) {
      const { specifiers } = node;
      const importDeclarations = specifiers.map(specifier => {
        return types.importDeclaration(
          [
            types.importDefaultSpecifier(specifier.local)
          ], types.stringLiteral(
            libraryDirectory?`${libraryName}/${specifier.imported.name}`:`${libraryName}/lib/${specifier.imported.name}`
          ));
      });
      path.replaceWithMultiple(importDeclarations);
    }

  }
}

module.exports = function () {
  return {
    visitor
  }
}