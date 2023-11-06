'use strict';

const { watch, promises: { readFile } } = require('fs')

class File {
    watch(event, filename) {
        console.log('this', this)
        console.log('arguments', Array.prototype.slice.call(arguments))
        this.showContent(filename)
    }

    async showContent(filename) {
        console.log((await readFile(filename)).toString())
    }
}

// watch(__filename, async (event, filename) => {
//     console.log((await readFile(filename)).toString())
// })

const file = new File()
// this way it will ignore the 'this' of File class
// inherit this of watch!
// watch(__filename, file.watch)

// alternative to not inherit the function's this
// but it's ugly!
// watch(__filename, (event, filename) => file.watch(event, filename))

// we can let explicit the context that the functionque must follow
// the bind returns a function with 'this' that stays from the file, ignoring watch
watch(__filename, file.watch.bind(file))

// the difference between one and another is that the first we pass arguments as a list of arguments and the second as array
file.watch.call({ showContent: () => console.log('call: hey sinon!') }, null, __filename )
file.watch.apply({ showContent: () => console.log('apply: hey sinon!') }, [null, __filename] )


