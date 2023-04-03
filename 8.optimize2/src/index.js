// import "./index.css";
// import img from "./img.png";

// console.log("index", img);

/**
 * optimization: {
 *  // moduleIds: "deterministic", // 根据模块名称生成简短的hash值
 *  moduleIds: "natural", // 自然数；默认；按使用顺序的数字ID；删除某些些文件可能会导致缓存失效
 *  // chunkIds: "deterministic",
 *  chunkIds: "natural",
 * }
 */
import("./one");
// 如果是natural；则会导致导致缓存失效；甚至是错误，因为原来的3.js变成了2.js
//import('./two');
import("./three");
