import { pipeline } from 'stream/promises'
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

// writable stream
async function* output(stream) {
  for await (const data of stream) {
    // ?=- -> look from - to behind
    // :"(?<name>.*) -> look for the content after ':"' and extract it to the group named 'name'
    const name = data.match(/:"(?<name>.*)(?=-)/).groups.name
    console.log(`[${name.toLowerCase()}] ${data}`)
    yield
  }
}

// passthrough stream
async function* merge(streams) {
  for (const readable of streams) {
    // make it work with objectMode (so we don't need to work with buffer)
    readable.setEncoding('utf8')
    for await (const chunk of readable) {
      for (const line of chunk.trim().split(/\n/)) {
        yield line
      }
    }
  }
}

await pipeline(
  merge(results),
  output,
)