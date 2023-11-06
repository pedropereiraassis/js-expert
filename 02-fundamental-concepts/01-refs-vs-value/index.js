const { deepStrictEqual } = require('assert')
let counter = 0
let counter2 = counter 
counter2++ 
// ?

const item = { counter: 0}
const item2 = item 

// primitive type generates in memory copy
deepStrictEqual(counter, 0)
deepStrictEqual(counter2, 1)

// reference type copies the memory address and points to the same place
item2.counter ++
deepStrictEqual(item, { counter: 1})
item.counter ++
deepStrictEqual(item2, { counter: 2})
