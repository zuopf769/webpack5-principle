const express = require('express');

const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const options = require('./webpack.config');

const compiler = webpack(options);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(4000);
