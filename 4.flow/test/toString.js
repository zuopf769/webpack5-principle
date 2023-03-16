const arr = [1, 2, 3]
console.log(arr.join(','))
console.log(arr.toString())

const obj = [{ key: 1 }, { key: 2 }, { key: 3 }]

// toString后会自动加,分隔符
console.log(obj.map(item => item['key']).toString())
