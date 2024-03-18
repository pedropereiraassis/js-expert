import { createServer } from 'http'
import Events from 'events'

const myEvent = new Events()

function onData() {
  const items = []
  setInterval(function myInterval() { items.push(Date.now()) })

}
// myEvent.on('data', onData) - should be here
createServer(function handler(request, response) {
  myEvent.on('data', onData) // should not be here

  myEvent.emit('data', Date.now())

  response.end('ok')
}).listen(3000, () => console.log('running at 3000'))