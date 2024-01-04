import { expect, describe, test, jest, beforeEach, beforeAll, afterAll } from '@jest/globals'
import { tmpdir } from 'os'
import { join } from 'path'
import fsPromises from 'fs/promises'
import { createLayerIfNotExists } from '../../src/createLayers.js'


async function getFolders({ mainPath, defaultMainFolder }) {
  return fsPromises.readdir(join(mainPath, defaultMainFolder))
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

  test.todo('Repository class should have create, read, update and delete methdos')
  test.todo('Service should have the same signature of repository and call all its methods')
})
