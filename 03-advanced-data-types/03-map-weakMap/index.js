const assert = require('assert')

const myMap = new Map()

// can have anything as key
myMap
  .set(1, 'one')
  .set('Pedro', { user: 'Pedro' })
  .set(false, () => 'hello')

const myMapWithConstructor = new Map([
  ['1', 'str1'],
  [1, 'num1'],
  [true, 'bool1'],
])

// console.log('myMap', myMap)
// console.log('myMap.get(1)', myMap.get(1))
assert.deepStrictEqual(myMap.get(1), 'one')
assert.deepStrictEqual(myMap.get('Pedro'), { user: 'Pedro' })
assert.deepStrictEqual(myMap.get(false)(), 'hello')

// in Objects keys can only be string or Symbols (number is coerged to string)
const onlyReferenceWorks = { id: 1 }
myMap.set(onlyReferenceWorks, { name: 'Pedro Assis' })

// console.log(myMap.get({ id: 1 }))
// console.log(myMap.get(onlyReferenceWorks))
assert.deepStrictEqual(myMap.get({ id: 1 }), undefined)
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), { name: 'Pedro Assis' })

// utilities
// -- to check the number of keys 
// in Object: would be Object.keys({ a: 1 }).length
assert.deepStrictEqual(myMap.size, 4)

// -- to verify if item exists
// in Object: item.key = if not exists returns undefined and the if() coerges to boolean and returns false
// the right way in Object would be ({ name: 'Pedro' }).hasOwnProperty('name')
assert.ok(myMap.has(onlyReferenceWorks))

// -- to remove an item
// in Object: delete item.id (not performatic at all)
assert.ok(myMap.delete(onlyReferenceWorks))

// -- to iterate through the items
// in Object: there's no way to do it 'directly', only transforming with Object.entries(item)
assert.deepStrictEqual(JSON.stringify([...myMap]), JSON.stringify([[1,"one"],["Pedro",{"user":"Pedro"}],[false,null]]))

// for (const [key, value] of myMap) {
//   console.log({ key, value })
// }

// Object is unsafe because depending on the key's name it can substitute some JS's default behavior
// ({ }).toString() === '[object Object]'
// ({ toString: () => 'Hey' }).toString() === 'Hey'

// any key can collide with the inherited properties of the object, like:
// contructor, toString, valueOf, etc
// Map does not have that issue

const actor = {
  name: 'John Doe',
  toString: 'John string',
}

// Map does not have key name restrition
myMap.set(actor)

assert.ok(myMap.has(actor))
assert.throws(() => myMap.get(actor).toString, TypeError)

// -- clear item withou reassign it
// in Object: can't do that
myMap.clear()
assert.deepStrictEqual([...myMap], [])



/* --- WeakMap --- */

// - can be collected after losing references
// - used in very specific cases
// - has most of Map benefits
// - BUT is not iterable
// - only reference and known keys can be used
// ligther and presights memory leak because after instances leave the memory everything is cleared

const weakMap = new WeakMap()
const hero = { name: 'Flash' }

// console.log(weakMap.set(hero, true))
// console.log(weakMap.get(hero))
// console.log(weakMap.delete(hero))
// console.log(weakMap.has(hero))