import { Duplex, Transform } from 'stream'

let count = 0;

const server = new Duplex({
  objectMode: true, // so we don't need to work with buffer => uses more memory
  enconding: 'utf-8',
  read() {
    const everySecond = (intervalContext) => {
      if (count++ <= 5) {
        this.push(`My name is Pedro-${count}`)
        return
      }

      clearInterval(intervalContext)
      this.push(null)
    }
    
    setInterval(function () { everySecond(this) })
  },
  // it's like a completely different object!
  write(chunk, enconding, cb) {
    console.log(`[writable] saving`, chunk)
    cb()
  }
})

// prove that read() and write() are different channels!
// write calls the writable from Duplex
server.write('[duplex] hey this is a writable!\n')
// on data -> receives (in this case logs) everything from .push() on the readable
// server.on('data', (msg) => console.log(`[readable] ${msg}`))

// push lets you send more data
server.push(`[duplex] hey this is also a readable!\n`)

// server
//   .pipe(process.stdout)

const transformToUpperCase = new Transform({
  objectMode: true,
  transform(chunk, enconding, cb) {
    cb(null, chunk.toUpperCase())
  }
})

// transform is also a duplex but doesn't have independent communication
transformToUpperCase.write('[transform] hellor from write!')

// push ignores what you have on the transform function
transformToUpperCase.push('[transform] hello from push!\n')

server
  .pipe(transformToUpperCase)
  // redirects all data from the readable to the writable of the duplex
  .pipe(server)