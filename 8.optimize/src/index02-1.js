import any from "any";

// 可以配置mainFiles: ["index.js", "base.js"]
// import any from "any";

// 通过别名能把bootstrap的样式文件css文件加载进来，而不加载他的js文件
require("bootstrap");
// import bootstrap from "bootstrap";

console.log("index", any);
