const webpack = require("webpack");
const fs = require("fs");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
//4.执行对象的run方法开始执行编译
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      assets: true,
      chunks: true,
      modules: true,
    })
  );
  fs.writeFileSync(
    "./stats.json",
    JSON.stringify(
      stats.toJson({
        assets: true,
        chunks: true,
        modules: true,
      })
    )
  );
});
