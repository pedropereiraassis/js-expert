const { once } = require('events')
const http = require('http')

const DEFAULT_USER = {
  username: 'PedroAssis',
  password: '123'
}

const routes = {
  'get:/contact': (request, response) => {
    response.write('contact us page')
    return response.end()
  },
  // PASS curl -i -X POST --data '{ "username": "PeDRoaSsIs", "password": "123" }' localhost:3000/login
  // DON'T PASS curl -i -X POST --data '{ "username": "Pedroassis", "password": "13" }' localhost:3000/login
  'post:/login': async (request, response) => {
    const data = JSON.parse(await once(request, 'data'))
    const toLower = (text) => text.toLowerCase()
    if (toLower(data.username) !== toLower(DEFAULT_USER.username) || data.password !== DEFAULT_USER.password) {
      response.writeHead(401)
      return response.end('Login failed')
    }

    return response.end('Login succeeded')
  },
  default(request, response) {
    response.writeHead(404)
    return response.end('not found')
  },
}

function handler(request, response) {
  const { url, method } = request
  const routeKey = `${method.toLowerCase()}:${url.toLowerCase()}`

  const chosenRoute = routes[routeKey] || routes.default
  return chosenRoute(request, response)
}

const app = http.createServer(handler)
  .listen(3000, () => console.log('running at 3000'))

module.exports = app