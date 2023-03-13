let resolves = []
resolves.push(() => console.log(1))
resolves.push(() => console.log(2))
resolves.push(() => console.log(3))
debugger
while (resolves.length > 0) {
  debugger
  //取出数组的第1个元素
  const resolve = resolves.shift()
  resolve()
}
resolves.forEach(resolve => resolve())
