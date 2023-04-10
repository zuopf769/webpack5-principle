let str = "webpackChunkName: 'title'";
// \s* 空格可有可无; 'title'前面的空格可又可无
// ['"] 一个单引号或者双引号都可以;
// ([^'"]+) 中间的name是除了'和"都可以；1个多多个
let regexp = /webpackChunkName:\s*['"]([^'"]+)['"]/;
console.log(str.match(regexp)[1]);
