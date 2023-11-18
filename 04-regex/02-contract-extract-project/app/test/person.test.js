const { describe, it } = require('mocha')
const { expect } = require('chai')
const Person = require('../src/person')

describe('Person', () => {
  it('should generate a person instance from properties list', () => {
    const content = [
      'Xuxa da Silva',
      'brasileira',
      'casada',
      'CPF 235.743.420-12',
      'residente e domiciliada a Rua dos bobos',
      'zero',
      'bairro Alphaville',
      'São Paulo.'
    ]

    const person = new Person(content)

    const expected = {
      name: 'Xuxa da Silva',
      country: 'Brasileira',
      civilState: 'Casada',
      document: '23574342012',
      street: 'Rua dos bobos',
      number: 'zero',
      neighbourhood: 'Alphaville',
      state: 'São Paulo',
    }

    expect(person).to.be.deep.equal(expected)
  })
})