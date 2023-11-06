9999999999999999 // 16
// 10000000000000000
true + 2
// 3
'21' + true
// '21true'
'21' - true
// 20
'21' - - 1
// 22
0.1 + 0.2 === 0.3
// false

3 > 2 > 1
// false
3 > 2 >= 1
// true

"B" + "a" + + "a" + "a"
// BaNaNa

'1' == 1
'1' === 1

// --------------

console.assert(String(123) === '123', "explicit convertion to string")
console.assert(123 + '' === '123', "implicit convertion to string")

console.assert(('hello' || 123) === 'hello', "|| returns the first element!")
console.assert(('hello' && 123) === 123, "&& returns the last element!")

// --------------
const item = {
    name: 'PedroAssis',
    age: 25,
    // string: 1 if not primitive calls valueOf
    toString() {
        return `Name: ${this.name}, Age: ${this.age}`
    },
    // number: 1 if not primitive calss toString
    valueOf() {
        return { hey: 'dude'}
        // return 007
    },
    // priority!
    [Symbol.toPrimitive](coercionType) {
        // console.log('trying to convert to', coercionType)
        const types = {
            string: JSON.stringify(this),
            number: '0007'
        }

        return types[coercionType] || types.string
    }
}

// console.log('toString', String(item))

// // returns NaN because toString returned a string
// console.log('valueOf', Number(item))

// after adding the toPrimitive
// console.log('String', String(item))
// console.log('Number', Number(item))
// // calls the default conversion!
// console.log('Date', new Date(item))

console.assert(item + 0 === '{"name":"PedroAssis","age":25}0')
// console.log('!!item is true?', !!item)
console.assert(!!item)

// console.log('string.concat', 'Ae'.concat(item))
console.assert('Ae'.concat(item) === 'Ae{"name":"PedroAssis","age":25}')

// console.log('implicit + explicit coercion (using ==)', item == String(item))
console.assert(item == String(item))

const item2 = { ...item, name: "Zézin", age: 20}
// console.log('New Object', item2)
console.assert(item2.name === "Zézin" && item2.age === 20)