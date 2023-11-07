const assert = require('assert')

/* ---- keys */
const uniqueKey = Symbol('userName')
const user = {}

user['userName'] = 'value of normal property'
user[uniqueKey] = 'value of symbol'

assert.deepStrictEqual(user.userName, 'value of normal property')
// always unique in memory address level
assert.deepStrictEqual(user[Symbol('userName')], undefined)
assert.deepStrictEqual(user[uniqueKey], 'value of symbol')

// hard to get but not secret
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey)

// byPass - bad practice (doesn't even has on node code base)
user[Symbol.for('password')] = 123
assert.deepStrictEqual(user[Symbol.for('password')], 123)
/* ---- keys */


/* ---- Well known symbols */
const obj = {
  // iterators
  [Symbol.iterator]: () => ({
    items: ['c', 'b', 'a'],
    next() {
      return {
        done: this.items.length === 0,
        value: this.items.pop()
      }
    }
  }),
}

assert.deepStrictEqual([...obj], ['a', 'b', 'c'])

const kItems = Symbol('kItems')
class MyDate {
  constructor(...args) {
    this[kItems] = args.map((arg) => new Date(...arg))
  }

  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== 'string') throw new TypeError()

    const items = this[kItems].map((item) => {
      return new Intl.DateTimeFormat('pt-BR', { month: 'long', day: '2-digit', year: 'numeric' }).format(item)
    })

    return new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(items)
  }

  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item
    }
  }

  async *[Symbol.asyncIterator]() {
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms))
    for (const item of this[kItems]) {
      await timeout(100)
      yield item.toISOString()
    }
  }

  get [Symbol.toStringTag]() {
    // by default returns 'Object'
    return 'WHAT?'
  }
}

const myDate = new MyDate([2023, 4, 23], [2023, 5, 12])
const expectedDates = [new Date(2023, 4, 23), new Date(2023, 5,12)]

assert.deepStrictEqual(Object.prototype.toString.call(myDate), '[object WHAT?]')
assert.throws(() => myDate + 1, TypeError)

// explicit coercion to call toPrimitive
assert.deepStrictEqual(String(myDate), '23 de maio de 2023 e 12 de junho de 2023')

assert.deepStrictEqual([...myDate], expectedDates)

// ;(async () => {
//   for await (const item of myDate) {
//     console.log('async iterator', item)
//   }
// })()

;(async () => {
  const dates = []

  for await (const date of myDate) {
    dates.push(date)
  }

  const expectedDatesInISOString = expectedDates.map((item) => item.toISOString())
  assert.deepStrictEqual(dates, expectedDatesInISOString)
})()