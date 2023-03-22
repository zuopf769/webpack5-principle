
function eslintPlugin({fix}) {
  return {
    pre(file) {
      file.set('errors',[]);
    },
    visitor: {
      CallExpression(path,state) {
        const { node } = path;
        const errors = state.file.get('errors');
        if (node.callee.object && node.callee.object.name === 'console') {
          Error.stackTraceLimit = 0;
          errors.push(path.buildCodeFrameError(`代码中不能出现console.log语句`),Error);
          if (fix) {
            path.parentPath.remove();
          }
        }
      }
    },
    post(file) {
      console.log(file.get('errors'));
    }
  }
}
module.exports = eslintPlugin;