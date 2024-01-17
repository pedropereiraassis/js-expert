import { Writable, PassThrough } from 'stream'
import axios from 'axios'

const API_01 = 'http://localhost:3000'
const API_02 = 'http://localhost:4000'

const responses = await Promise.all([
  axios({
    method: 'get',
    url: API_01,
    responseType: 'stream',
  }),
  axios({
    method: 'get',
    url: API_02,
    responseType: 'stream',
  })
])

const results = responses.map(({ data }) => data)

const output = new Writable({
  write(chunk, enc, callback) {
    const data = chunk.toString().replace(/\n/, '')
    // ?=- -> look from - to behind
    // :"(?<name>.*) -> look for the content after ':"' and extract it to the group named 'name'
    const name = data.match(/:"(?<name>.*)(?=-)/).groups.name
    console.log(`[${name.toLowerCase()}] ${data}`)
    callback()
  }
})

function merge(streams) {
  return streams.reduce((prev, current, index, items) => {
    // unable stream to close by itself
    current.pipe(prev, { end: false })

    // since we added '{ end: false }' we'll manually manipulate when curret ends
    // When current ends we'll verify if all streams on the pipeline were ended
    // Then it'll force the chain from the previous to close
    current.on('end', () => items.every((stream) => stream.ended) && prev.end())
    return prev
  }, new PassThrough())
}

merge(results).pipe(output)