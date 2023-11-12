const assert = require('assert');

const arr1 = ['0', '1', '2'];
const arr2 = ['2', '0', '3'];
const arr3 = arr1.concat(arr2)

assert.deepStrictEqual(arr3, [ '0', '1', '2', '2', '0', '3' ])

// majoritary used on Lists of unique items

const set = new Set();
arr1.map((item) => set.add(item));
arr2.map((item) => set.add(item));

assert.deepStrictEqual(Array.from(set), ['0', '1', '2', '3'])
assert.deepStrictEqual(Array.from(new Set([...arr1, ...arr2])), ['0', '1', '2', '3'])

// console.log(set.keys()) // only exists to follow the same pattern as Map
// console.log(set.values()) // only exists to follow the same pattern as Map

// on common Array to know if a value exists:
// [].indexOf('1') !== -1  OR  [].includes('0')
assert.ok(set.has('2'))

// does not have .get() - only can know if value exists


// catch value that has in both arrays (or only has in one)
const users01 = new Set([
  'pedro',
  'john doe',
  'bob'
])

const users02 = new Set([
  'jane doe',
  'pedro',
  'marley'
])

const intersection = new Set([...users01].filter((user) => users02.has(user)))
assert.deepStrictEqual(Array.from(intersection), ['pedro'])

const difference = new Set([...users01].filter((user) => !users02.has(user)))
assert.deepStrictEqual([...difference], ['john doe', 'bob'])


// weakSet

// same idea as weakMap
// not enurable (iterable) - nor is Set
// only works with keys as reference
// only simple methods

const user = { id: 123 }
const user2 = { id: 321 }

const weakSet = new WeakSet([ user ])
weakSet.add(user2)
weakSet.has(user)
weakSet.delete(user)
