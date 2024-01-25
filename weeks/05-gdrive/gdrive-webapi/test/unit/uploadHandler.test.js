import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import fs from 'fs'
import UploadHandler from '../../src/uploadHandler.js'
import TestUtil from '../util/testUtil.js'
import { resolve } from 'path'
import { pipeline } from 'stream/promises'
import { logger } from '../../src/logger.js'

describe('Upload Handler test suite', () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => { }
  }
  beforeEach(() => {
    jest.spyOn(logger, 'info')
      .mockImplementation()
  })

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

  describe('#handleFileBytes', () => {
    test('should call emit function and it is a transform stream', async () => {
      jest.spyOn(ioObj, ioObj.to.name)
      jest.spyOn(ioObj, ioObj.emit.name)

      const handler = new UploadHandler({
        io: ioObj,
        socketId: '01',
        downloadsFolder,
      })
      jest.spyOn(handler, handler.canExecute.name).mockReturnValueOnce(true)

      const messages = ['hello']
      const source = TestUtil.generateReadableStream(messages)
      const onWrite = jest.fn()
      const target = TestUtil.generateWritableStream(onWrite)

      await pipeline(
        source,
        handler.handleFileBytes('file.txt'),
        target,
      )

      expect(ioObj.to).toHaveBeenCalledTimes(messages.length)
      expect(ioObj.emit).toHaveBeenCalledTimes(messages.length)
      // if handleFileBytes is a transform stream the pipeline will continue the process
      // passing the data and calling target function
      expect(onWrite).toHaveBeenCalledTimes(messages.length)
      expect(onWrite.mock.calls.join()).toEqual(messages.join())
    })

    test('given message timer delay as 2secs it should emit only two messages during 2secs period', async () => {
      jest.spyOn(ioObj, ioObj.emit.name)

      const day = '2023-01-25 01:01'
      const twoSecondsPeriod = 2000

      // Date.now of this.lastMessageSent on handleFileBytes
      const onFirstLastMessageSent = TestUtil.getTimeFromDate(`${day}:00`)
      // first message 'hey'
      const onFirstCanExecute = TestUtil.getTimeFromDate(`${day}:02`)
      const onSecondUpdateLastMessageSent = onFirstCanExecute

      // second message 'hello', out of window time
      const onSecondCanExecute = TestUtil.getTimeFromDate(`${day}:03`)
      // second message 'world'
      const onThirdCanExecute = TestUtil.getTimeFromDate(`${day}:05`)

      TestUtil.mockDateNow([
        onFirstLastMessageSent,
        onFirstCanExecute,
        onSecondUpdateLastMessageSent,
        onSecondCanExecute,
        onThirdCanExecute,
      ])

      const messages = ['hello', 'hello', 'world']
      const fileName = 'file.avi'
      const expectedMessageSent = 2

      const source = TestUtil.generateReadableStream(messages)
      const handler = new UploadHandler({
        messageTimeDelay: twoSecondsPeriod,
        io: ioObj,
        socketId: '01',
      })

      await pipeline(
        source,
        handler.handleFileBytes(fileName)
      )
      expect(ioObj.emit).toHaveBeenCalledTimes(expectedMessageSent)
      const [firstCallResult, secondCallResult] = ioObj.emit.mock.calls

      expect(firstCallResult).toEqual([handler.ON_UPLOAD_EVENT, { alreadyProcessed: 'hello'.length, fileName }])
      expect(secondCallResult).toEqual([handler.ON_UPLOAD_EVENT, { alreadyProcessed: messages.join('').length, fileName }])
    })
  })

  describe('#canExecute', () => {
    test('should regurn true when time is later than specified delay', () => {
      const timerDelay = 1000
      const uploadHandler = new UploadHandler({
        io: {},
        socketId: '',
        downloadsFolder: '',
        messageTimeDelay: timerDelay,
      })
      const now = TestUtil.getTimeFromDate('2023-01-25 00:00:03')
      TestUtil.mockDateNow([now])
      const lastExecution = TestUtil.getTimeFromDate('2023-01-25 00:00:00')

      const result = uploadHandler.canExecute(lastExecution)
      expect(result).toBeTruthy()
    })
    test('should return false when time isnt later than specified delay', () => {
      const timerDelay = 3000
      const uploadHandler = new UploadHandler({
        io: {},
        socketId: '',
        downloadsFolder: '',
        messageTimeDelay: timerDelay,
      })
      const now = TestUtil.getTimeFromDate('2023-01-25 00:00:01')
      TestUtil.mockDateNow([now])
      const lastExecution = TestUtil.getTimeFromDate('2023-01-25 00:00:00')

      const result = uploadHandler.canExecute(lastExecution)
      expect(result).toBeFalsy()
    })
  })
})