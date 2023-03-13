// webpack如何利用 commonJs 实现 ESM 的 live binding 属性

import { a } from './03.async-data.js'
console.log('instance ', a)
setTimeout(() => {
  // 根据  ESM 规范，a 此时应该为 2
  console.log('a ', a)
}, 1000)
