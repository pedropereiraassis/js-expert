'use strict';

const { readFile } = require('fs/promises')
const { join } = require('path')
const pdf = require('pdf-parse');

const TextProcessorFacade = require('./textProcessorFacade');

;(async () => {
  const dataBuffer = await readFile(join(__dirname, '../../contract.pdf'))
  const contract = await pdf(dataBuffer)
  // console.log(contract.text)

  const textProcessorInstance = new TextProcessorFacade(contract.text)
  const people = textProcessorInstance.getPeopleFromPDF()
  console.log('people', people)
})()