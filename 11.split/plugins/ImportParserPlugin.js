class ImportParserPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(parser) {
    //import('./module1')
    parser.hooks.importCall.tap("ImportParserPlugin", (expr) => {
      const { options: importOptions } = parser.parseCommentOptions(expr.range);
      console.log(importOptions);
    });
  }
}
module.exports = ImportParserPlugin;
