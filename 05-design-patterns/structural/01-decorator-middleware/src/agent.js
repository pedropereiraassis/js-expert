import http from 'http'

async function injectHttpInterceptor() {
  const oldEmit = http.Server.prototype.emit;
  http.Server.prototype.emit = function (...args) {
    const [ type, _request, response ] = args

    if (type === 'request') {
      response.setHeader('X-Instrumented-By', 'PedroAssis')
    }

    return oldEmit.apply(this, args)
  }
}

export { injectHttpInterceptor }