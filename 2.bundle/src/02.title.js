// module.exports = 'title'

// module.exports = {
//   name: 'title_name',
//   age: 'title_age'
// }

function add(a, b) {
  return a + b
}

function multi(c, d) {
  return c * d
}

module.exports.name = 'title_name'
module.exports.age = 'title_age'
module.exports.add = add
module.exports.multi = multi
