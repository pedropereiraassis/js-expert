import { fork } from 'child_process'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Writable } from 'stream'
import csvToJson from 'csvtojson'

const database = './data/All_Pokemon.csv'
const PROCES_COUNT = 10
const replications = []

const backgroundTaskFile = './src/backgroundTask.js'
const processes = new Map()

for (let index = 0; index < PROCES_COUNT; index++) {
  const child = fork(backgroundTaskFile, [database])

  child.on('exit', () => {
    console.log(`process ${child.pid} exited`)
    processes.delete()
  })
  child.on('error', (error) => {
    console.log(`process ${child.pid} has error`, error)
    process.exit(1)
  })
  child.on('message', (msg) => {
    // workaround for multiprocessing
    if (replications.includes(msg)) {
      return
    }
    console.log(`${msg} is replicated!`)
    replications.push(msg)
  })

  processes.set(child.pid, child)
}

function roundRobin(array, index = 0) {
  return function () {
    if (index >= array.length) {
      index = 0
    }

    return array[index++]
  }
}

// Connection's Poll, or load balancer 
const getProcess = roundRobin([...processes.values()])
console.log(`starting with ${processes.size} processes`)

await pipeline(
  createReadStream(database),
  csvToJson(),
  Writable({
    write(chunk, enc, cb) {
      const chosenProcess = getProcess()
      chosenProcess.send(JSON.parse(chunk))
      cb()
    }
  })
)