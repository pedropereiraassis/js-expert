'use strict'

const assert = require('assert')

// guarantee semantic and security in objects

// ----- apply
const myObj = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue
  }
}
// Function.prototype.apply = () => { throw new Error('Wow!') }
// myObj.add.apply = function () { throw new Error('Yikes!') }

assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130)

// one problem that might occurs (rare)
// Function.prototype.apply = () => { throw new Error('Wow!') }

// another problem that might occurs (more possible)
// myObj.add.apply = function () { throw new Error('Yikes!') }

myObj.add.apply = function () { throw new TypeError('Yikes!') }

assert.throws(() => myObj.add.apply({}, []), { name: 'TypeError', message: 'Yikes!' })

// using Reflect:
const result = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200])
assert.deepStrictEqual(result, 260)
// ----- apply


// ----- defineProperty
function MyDate() {}

// UGLY, Object adding property to function?
Object.defineProperty(MyDate, 'withObject', { value: () => 'Hey object' })

// makes more sense
Reflect.defineProperty(MyDate, 'withReflection', { value: () => 'Hey reflect' })

assert.deepStrictEqual(MyDate.withObject(), 'Hey object')
assert.deepStrictEqual(MyDate.withReflection(), 'Hey reflect')
// ----- defineProperty


// ----- deleteProperty
const withDelete = { user: 'Pedro' }
// not performatic at all, avoid always when you can - does not respect JS life cycle
delete withDelete.user
assert.deepStrictEqual(withDelete.hasOwnProperty('user'), false)

const withReflection = { user: 'PEDRO' }
Reflect.deleteProperty(withReflection, 'user')
assert.deepStrictEqual(withReflection.hasOwnProperty('user'), false)
// ----- deleteProperty


// ----- get

// we should call 'get' only for reference instances
assert.deepStrictEqual(1['userName'], undefined)
assert.throws(() => Reflect.get(1, 'userName'), TypeError)
// ----- get


// ----- has
assert.ok('superman' in { superman: '' })
assert.ok(Reflect.has({ batman: '' }, 'batman'))
// ----- has


// ----- ownKeys
const user = Symbol('user')
const databaseUser = {
  id: 1,
  [Symbol.for('password')]: 123,
  [user]: 'pedroassis',
}

// with object methods we need to make 2 requests
const objectKeys = [
  ...Object.getOwnPropertyNames(databaseUser),
  ...Object.getOwnPropertySymbols(databaseUser),
]
assert.deepStrictEqual(objectKeys, ['id', Symbol.for('password'), user])

// using Reflect only needs 1 request
assert.deepStrictEqual(Reflect.ownKeys(databaseUser), ['id', Symbol.for('password'), user])