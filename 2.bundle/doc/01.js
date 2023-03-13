const toString = Object.prototype.toString
console.log(toString.call('foo'))
console.log(toString.call([]))
console.log(toString.call(1))
console.log(toString.call(true))
console.log(toString.call(undefined))
console.log(toString.call(null))

const myExports = {}
Object.defineProperty(myExports, Symbol.toStringTag, { value: 'Module' })
console.log(toString.call(myExports))
