let path = require('path');
module.exports = {
    mode: 'development',
    devtool: false,
    entry: {
        // chunk的名称、值是入口模块的路径
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
    }
}