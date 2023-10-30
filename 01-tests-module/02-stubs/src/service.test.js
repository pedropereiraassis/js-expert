const Service = require('./service');
const assert = require('assert');
const { createSandbox } = require('sinon');

const BASE_URL_1 = 'https://swapi.dev/api/planets/1'
const BASE_URL_2 = 'https://swapi.dev/api/planets/2'
const mocks = {
  tatooine: require('../mocks/tatooine.json'),
  alderaan: require('../mocks/alderaan.json'),
}

;(async () => {
  // {
  //   // search on internet
  //   const service = new Service()
  //   const data = await service.makeRequest(BASE_URL_2)
  //   console.log('data', JSON.stringify(data))
  // }

  const service = new Service()
  const sinon = createSandbox()
  const stub = sinon.stub(service, service.makeRequest.name)

  stub.withArgs(BASE_URL_1).resolves(mocks.tatooine)
  stub.withArgs(BASE_URL_2).resolves(mocks.alderaan)

  {
    const expected = {
      name: 'Tatooine',
      surfaceWater: '1',
      appearsIn: 5,
    }

    const result = await service.getPlanets(BASE_URL_1)
    assert.deepStrictEqual(result, expected)
  }

  {
    const expected = {
      name: 'Alderaan',
      surfaceWater: '40',
      appearsIn: 2,
    }

    const result = await service.getPlanets(BASE_URL_2)
    assert.deepStrictEqual(result, expected)
  }
})()