import { expect, describe, test, jest, beforeEach, beforeAll, afterAll } from '@jest/globals'
import { tmpdir } from 'os'
import { join } from 'path'
import fsPromises from 'fs/promises'
import { createLayerIfNotExists } from '../../src/createLayers.js'
import { createFiles } from '../../src/createFiles.js'
import Util from '../../src/util.js'

function getAllFunctionsFromInstance(instance) {
  return Reflect.ownKeys(Reflect.getPrototypeOf(instance))
    .filter((method) => method !== 'constructor')
}

function generateFilesPaths({ mainPath, defaultMainFolder, layers, componentName }) {
  return layers.map((layer) => {
    const fileName = `${componentName}${Util.upperCaseFirstLetter(layer)}.js`
    return join(mainPath, defaultMainFolder, layer, fileName)
  })
}

describe('#Integration - Files - Files Structure', () => {
  const config = {
    defaultMainFolder: 'src',
    mainPath: '',
    layers: ['factory', 'repository', 'service'],
    componentName: 'heroes',
  }

  const packageJSON = 'package.json'
  const packageJSONLocation = join('./test/integration/mocks', packageJSON)

  beforeAll(async () => {
    config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), 'layers-'))
    await fsPromises.copyFile(packageJSONLocation, join(config.mainPath, packageJSON))
    await createLayerIfNotExists(config)
  })

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await fsPromises.rm(config.mainPath, { recursive: true })
  })

  test('Repository class should have create, read, update and delete methdos', async () => {
    const myConfig = {
      ...config,
      layers: ['repository'],
    }

    await createFiles(myConfig)
    const [repositoryFile] = generateFilesPaths(myConfig)
    const { default: Repository } = await import(repositoryFile)
    const repository = new Repository()

    const expectNotImplemented = (fn) => expect(() => fn.call()).rejects.toEqual('method not implemented')
    expectNotImplemented(repository.create)
    expectNotImplemented(repository.read)
    expectNotImplemented(repository.update)
    expectNotImplemented(repository.delete)
  })

  test('Service should have the same signature of repository and call all its methods', async () => {
    const myConfig = {
      ...config,
      layers: ['repository', 'service'],
    }

    await createFiles(myConfig)
    const [repositoryFile, serviceFile] = generateFilesPaths(myConfig)
    const { default: Repository } = await import(repositoryFile)
    const { default: Service } = await import(serviceFile)
    const repository = new Repository()
    const service = new Service({ repository })

    const allRepositoryMethods = getAllFunctionsFromInstance(repository)
    allRepositoryMethods.forEach((method) => jest.spyOn(repository, method).mockResolvedValue())

    getAllFunctionsFromInstance(service).forEach((method) => service[method]())

    allRepositoryMethods.forEach((method) => expect(repository[method]).toHaveBeenCalled())

  })
  test('Factory instance should match layers', async () => {
    const myConfig = {
      ...config,
    }

    await createFiles(myConfig)
    const [factoryFile, repositoryFile, serviceFile] = generateFilesPaths(myConfig)
    const { default: Repository } = await import(repositoryFile)
    const { default: Service } = await import(serviceFile)
    const { default: Factory } = await import(factoryFile)

    const expectedServiceInstance = new Service({ repository: new Repository() })
    const serviceInstance = Factory.getInstance()

    expect(serviceInstance).toMatchObject(expectedServiceInstance)
    expect(serviceInstance).toBeInstanceOf(Service)
  })
})
