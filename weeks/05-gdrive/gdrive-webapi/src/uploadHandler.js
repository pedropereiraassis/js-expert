import Busboy from 'busboy'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { logger } from './logger.js'

export default class UploadHandler {
  constructor({ io, socketId, downloadsFolder }) {
    this.io = io
    this.socketId = socketId
    this.downloadsFolder = downloadsFolder
  }

  handleFileBytes() {

  }

  async onFile(fieldName, file, fileName) {
    const saveTo = `${this.downloadsFolder}/${fileName}`
    await pipeline(
      // 1st get a readable stream
      file,
      // 2nd filter, convert, transform data
      this.handleFileBytes(fileName),
      // 3rd process exit = a writable stream
      fs.createWriteStream(saveTo)
    )

    logger.info(`File [${fileName}] finished`)
  }

  registerEvents(headers, onFinish) {
    const busboy = Busboy({ headers })
    busboy.on('file', this.onFile.bind(this))
    busboy.on('finish', onFinish)

    return busboy
  }
}