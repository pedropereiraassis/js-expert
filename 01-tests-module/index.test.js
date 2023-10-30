const { error } = require('./src/constants')
const File = require('./src/file')
const assert = require('assert')

// IFEE
;(async () => {

  // variables created in this block will be valid only their execution
  {
    const filePath = './mocks/emptyFile-invalid.csv'
    const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJSON(filePath)
    await assert.rejects(result, expected)
  }

  {
    const filePath = './mocks/missingHeader-invalid.csv'
    const expected = new Error(error.FILE_FIELDS_ERROR_MESSAGE)
    const result = File.csvToJSON(filePath)
    await assert.rejects(result, expected)
  }

  {
    const filePath = './mocks/fiveItems-invalid.csv'
    const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJSON(filePath)
    await assert.rejects(result, expected)
  }

  {
    const filePath = './mocks/threeItems-valid.csv'
    const expected = [
      {
        id: 1,
        name: 'john',
        profession: 'developer',
        age: 26,
      },
      {
        id: 2,
        name: 'george',
        profession: 'manager',
        age: 42,
      },
      {
        id: 3,
        name: 'david',
        profession: 'QA',
        age: 34,
      },
    ]
    const result = await File.csvToJSON(filePath)
    assert.deepEqual(result, expected)
  }
})()