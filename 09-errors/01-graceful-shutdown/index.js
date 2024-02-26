import { createServer } from 'http'
import { MongoClient } from 'mongodb'
import { promisify } from 'util'

async function dbConnect() {
  const client = new MongoClient('mongodb://localhost:27017')
  await client.connect()

  console.log('mongodb is connected!')

  const db = client.db('comics')
  return {
    collections: { heroes: db.collection('heroes') },
    client,
  }
}

const { collections, client } = await dbConnect()

async function handler(request, response) {
  for await (const data of request) {
    try {
      const hero = JSON.parse(data)
      await collections.heroes.insertOne({ ...hero, updatedAt: new Date().toISOString() })

      const heroes = await collections.heroes.find().toArray()

      response.writeHead(200)
      response.write(JSON.stringify(heroes))
    } catch (error) {
      console.log('request error', error)
      response.writeHead(500)
      response.write(JSON.stringify({ message: 'Internal Server Error' }))
    } finally {
      response.end()
    }
  }
}

/*
  curl -i localhost:3000 -X POST --data '{"name": "Batman", "age": 40}'
*/

const server = createServer(handler)
  .listen(3000, () => console.log('running at port 3000 with process', process.pid))

const onStop = async (signal) => {
  console.info(`\n${signal} signal received`)

  console.log('Closing http server')
  await promisify(server.close.bind(server))
  console.log('Http server has closed!')
  
  // close(true) -> force closing
  await client.close()
  console.log('Mongo connection has closed!')

  // 0 -> everything fine, 1 -> error!
  process.exit(0)
}

// SIGINT -> Ctrl + C
// SIGTERM -> KILL
['SIGINT', 'SIGTERM'].forEach((event) => process.on(event, onStop))