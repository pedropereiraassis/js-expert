'use strict';

const { readFile } = require('fs/promises')
const { join } = require('path')
const pdf = require('pdf-parse')

;(async () => {
  const dataBuffer = await readFile(join(__dirname, '../../contract.pdf'))
  const contract = await pdf(dataBuffer)
  console.log(contract.text)
})()