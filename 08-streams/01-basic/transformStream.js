import { Readable, Transform } from 'stream'
// import { createWriteStream } from 'fs'

// data input
const readable = new Readable({
  read() {
    // for (let index = 0; index < 1e5; index++) {
    for (let index = 0; index < 10; index++) {
      const person = { id: Date.now() + index, name: `Pedro-${index}` }
      const data = JSON.stringify(person)
      this.push(data)
    }
   
    // inform that all data has been received
    this.push(null)
  }
})

// data process
const mapFields = new Transform({
  transform(chunk, enconding, cb) {
    const data = JSON.parse(chunk)
    const result = `${data.id}, ${data.name.toUpperCase()}\n`

    cb(null, result)
  }
})

const mapHeaders = new Transform({
  transform(chunk, enconding, cb) {
    this.counter = this.counter ?? 0
    if (this.counter) {
      return cb(null, chunk)
    }

    this.counter += 1
    cb(null, 'id,name\n'.concat(chunk))
  }
})

const pipeline = readable
  .pipe(mapFields)
  .pipe(mapHeaders)
  //  writable is always the output -> print, save, ignore
  // data output
  .pipe(process.stdout)
  // .pipe(createWriteStream('my.csv'))

pipeline.on('end', () => console.log('finished'))