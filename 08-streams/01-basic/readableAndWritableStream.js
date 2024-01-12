import { Readable, Writable } from 'stream'

// data input
const readable = new Readable({
  read() {
    this.push('Hello World 1')
    this.push('Hello World 2')
    this.push('Hello World 3')

    // inform that all data has been received
    this.push(null)
  }
})

// data output
const writable = new Writable({
  write(chunk, enconding, cb) {
    console.log('msg', chunk.toString())

    cb()
  }
})

readable
  //  writable is always the output -> print, save, ignore
  .pipe(writable)
  // .pipe(process.stdout)