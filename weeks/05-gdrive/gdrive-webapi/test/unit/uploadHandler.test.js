import { describe, test, expect, jest } from '@jest/globals'
import fs from 'fs'
import UploadHandler from '../../src/uploadHandler.js'
import TestUtil from '../util/testUtil.js'
import { resolve } from 'path'

describe('Upload Handler test suite', () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {}
  }
  const downloadsFolder = '/tmp'

  describe('#registerEvents', () => {
    test('should call onFile and onFinish functions on busboy instance', () => {
      const uploadHandler = new UploadHandler({
        io: ioObj,
        socketId: '01',
        downloadsFolder,
      })
      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue()

      const headers = {
        'content-type': 'multipart/form-data; boundary=a'
      }
      const onFinish = jest.fn()
      const busboyInstance = uploadHandler.registerEvents(headers, onFinish)

      const fileStream = TestUtil.generateReadableStream(['chunk', 'of', 'data'])
      busboyInstance.emit('file', 'fieldname', fileStream, 'file.txt')
      busboyInstance.listeners('finish')[0].call()

      expect(uploadHandler.onFile).toHaveBeenCalled()
      expect(onFinish).toHaveBeenCalled()
    })
  })

  describe('#onFile', () => {
    test('given a stream file it should save it on disk', async () => {
      const chunks = ['hey', 'dude']
      const handler = new UploadHandler({
        io: ioObj,
        socketId: '01',
        downloadsFolder,
      })

      const onData = jest.fn()
      jest.spyOn(fs, fs.createWriteStream.name)
        .mockImplementation(() => TestUtil.generateWritableStream(onData))

      const onTransform = jest.fn()
      jest.spyOn(handler, handler.handleFileBytes.name)
        .mockImplementation(() => TestUtil.generateTransformStream(onTransform))
      
      const params = {
        fieldName: 'video',
        file: TestUtil.generateReadableStream(chunks),
        fileName: 'mockfile.mov',
      }

      await handler.onFile(...Object.values(params))

      expect(onData.mock.calls.join()).toEqual(chunks.join())
      expect(onTransform.mock.calls.join()).toEqual(chunks.join())
      
      const expectedFileName = resolve(handler.downloadsFolder, params.fileName)
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFileName)
    })
  })
})