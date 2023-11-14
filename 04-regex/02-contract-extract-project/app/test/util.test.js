const { describe, it } = require('mocha')
const { expect } = require('chai')
const { evaluateRegex, InvalidRegexError } = require('../src/util')

describe('Util', () => {
  it('#evaluateRegex should throw error using unsafe regex', () => {
    const unsafeRegex = /^([a-z|A-Z|0-9]+\s?)+$/ // catastrophic backtracking

    expect(() => evaluateRegex(unsafeRegex)).to.throw(InvalidRegexError, `Unsafe regex - ${unsafeRegex}`)
  })

  it('#evaluateRegex should not throw error using safe regex', () => {
    const safeRegex = /^([a-z])$/

    expect(() => evaluateRegex(safeRegex)).to.not.throw
    expect(evaluateRegex(safeRegex)).to.be.deep.equal(safeRegex)
  })
})