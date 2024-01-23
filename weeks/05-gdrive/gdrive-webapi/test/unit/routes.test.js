import { describe, test, expect, jest } from '@jest/globals'
import Routes from '../../src/routes.js'

describe('Routes test suite', () => {
  describe('#setSocketInstance', () => {
    test('setSocketInstance should store io instance', () => {
      const routes = new Routes()
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {}
      }

      routes.setSocketInstance(ioObj)
      expect(routes.io).toStrictEqual(ioObj)
    })
  })

  describe('#handler', () => {
    const defaultParams = {
      request: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: '',
        body: {}
      },
      response: {
        setHeader: jest.fn(),
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      values: () => Object.values(defaultParams)
    }

    test('given an inexisting route should choose default route', () => {
      const routes = new Routes()
      const params = {
        ...defaultParams,
      }
      params.request.method = 'inexistent'
      routes.handler(...params.values())

      expect(params.response.end).toHaveBeenCalledWith('Hello World')
    })
  })
})