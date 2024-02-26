import { createServer } from 'http'
import { statusCodes } from './util/httpStatusCodes.js'
import HeroEntity from './heroEntity.js'

async function handler(request, response) {
  for await (const data of request) {
    try {
      const parsedData = JSON.parse(data)

      if (Reflect.has(parsedData, 'connectionError')) {
        // just generic error
        throw new Error('error conncting to DB!')
      }

      const hero = new HeroEntity(parsedData)
      if (!hero.isValid()) {
        response.writeHead(statusCodes.BAD_REQUEST)
        response.end(hero.notifications.join('\n'))
        continue
      }

      // register on database..

      response.writeHead(statusCodes.OK)
      response.end()
    } catch (error) {
      response.writeHead(statusCodes.INTERNAL_SERVER_ERROR)
      response.end()
    }
  }
}

createServer(handler).listen(3000, () => console.log('running at 3000'))

/*
curl -i localhost:3000 -X POST -d '{"name": "Avenger", "age": 50}'
*/