import { expect, describe, test, jest, beforeEach, beforeAll, afterAll } from '@jest/globals'
import { tmpdir } from 'os'
import { join } from 'path'
import fsPromises from 'fs/promises'
import { createLayerIfNotExists } from '../../src/createLayers.js'


async function getFolders({ mainPath, defaultMainFolder }) {
  return fsPromises.readdir(join(mainPath, defaultMainFolder))
}

describe('#Integration - Layers - Folders Structure', () => {
  const config = {
    defaultMainFolder: 'src',
    mainPath: '',
    layers: ['factory', 'repository', 'service'],
  }

  beforeAll(async () => {
    config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), 'skeleton-'))
  })

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await fsPromises.rm(config.mainPath, { recursive: true })
  })

  test('should not create folders if it exists', async () => {
    const beforeRun = await fsPromises.readdir(config.mainPath)

    await createLayerIfNotExists(config)

    const afterRun = await getFolders(config)

    expect(beforeRun).not.toStrictEqual(afterRun)
    expect(afterRun).toEqual(config.layers)
  })
  test('should create folders if it doesnt exists', async () => {
    const beforeRun = await getFolders(config)

    await createLayerIfNotExists(config)

    const afterRun = await getFolders(config)

    expect(afterRun).toEqual(beforeRun)
  })
})
