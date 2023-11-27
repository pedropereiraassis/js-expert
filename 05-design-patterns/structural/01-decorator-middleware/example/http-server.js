import http from 'http'
import { injectHttpInterceptor } from '../index.js'
injectHttpInterceptor()

function handleRequest(request, response) {
  // response.setHeader('X-Instrumented-By', 'PedroAssis')
  response.end('Hello world!')
}

const server = http.createServer(handleRequest)
const port = 3000
server.listen(port, () => console.log('server running at', server.address().port))