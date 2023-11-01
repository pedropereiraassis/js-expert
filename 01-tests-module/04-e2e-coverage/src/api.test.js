const { describe, it, before, after } = require('mocha')
const supertest = require('supertest')
const assert = require('assert')

describe('API Suite test', () => {
  let app
  
  before((done) => {
    app = require('./api')
    app.once('listening', done)
  })

  after((done) => app.close(done))

  describe('get:/contact', () => {
    it('should request the contact route and return HTTP status 200', async () => {
      const response = await supertest(app)
        .get('/contact')
        .expect(200)
      
      assert.strictEqual(response.text, 'contact us page')
    })
  })

  describe('post:/login', () => {
    it('should request the login and return HTTP status 200', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: 'PeDRoaSSiS', password: '123'})
        .expect(200)
      
      assert.strictEqual(response.text, 'Login succeeded')
    })

    it('should request the login and return HTTP status 401', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: 'jOhnDOe', password: '123'})
        .expect(401)
      
      assert.ok(response.unauthorized)
      assert.strictEqual(response.text, 'Login failed')
    })
  })

  describe('get:/hi', () => {
    it('should request an inexisting route and return HTTP status 404', async () => {
      const response = await supertest(app)
        .get('/hi')
        .expect(404)

      assert.strictEqual(response.text, 'not found')
    })
  })
})