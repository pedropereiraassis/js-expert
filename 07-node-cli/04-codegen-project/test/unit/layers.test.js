import { expect, describe, test, jest, beforeEach } from '@jest/globals'
import { createLayerIfNotExists } from '../../src/createLayers.js'
import fsPromises from 'fs/promises'
import fs from 'fs'

describe('#Layers - Folder Structure', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  const defaultLayers = ['service', 'factory', 'repository']

  test('#createLayerIfNotExists should create folders if doesnt exist', async () => {
    jest.spyOn(fsPromises, fsPromises.mkdir.name).mockResolvedValue()
    jest.spyOn(fs, fs.existsSync.name).mockReturnValue(false)

    await createLayerIfNotExists({ mainPath: '', layers: defaultLayers })

    expect(fs.existsSync).toHaveBeenCalledTimes(defaultLayers.length)
    expect(fsPromises.mkdir).toHaveBeenCalledTimes(defaultLayers.length)
  })

  test('#createLayerIfNotExists should not create folders if exist', async () => {
    jest.spyOn(fsPromises, fsPromises.mkdir.name).mockResolvedValue()
    jest.spyOn(fs, fs.existsSync.name).mockReturnValue(true)

    await createLayerIfNotExists({ mainPath: '', layers: defaultLayers })

    expect(fs.existsSync).toHaveBeenCalledTimes(defaultLayers.length)
    expect(fsPromises.mkdir).not.toHaveBeenCalled()
  })
})