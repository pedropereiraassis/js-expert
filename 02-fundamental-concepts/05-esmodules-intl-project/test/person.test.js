import { describe, it } from 'mocha'
import { expect } from 'chai'
import Person from '../src/person.js'

describe('Person', () => {
  it('should generate a person instance from a string', () => {
    const person = Person.generateInstanceFromString('1 Car,Motocycle 25000 2022-01-15 2022-02-04')

    const expected = {
      id: '1',
      vehicles: ['Car', 'Motocycle'],
      kmTraveled: '25000',
      from: '2022-01-15',
      to: '2022-02-04'
    }

    expect(person).to.be.deep.equal(expected)
  })

  it('should format values', () => {
    const person = new Person({
      id: '1',
      vehicles: ['Car', 'Motocycle'],
      kmTraveled: '25000',
      from: '2022-01-15',
      to: '2022-02-04'
    })

    const formattedPerson = person.formatted('pt-BR')
    const expected = {
      id: 1,
      vehicles: 'Car e Motocycle',
      kmTraveled: '25.000 km',
      from: '15 de janeiro de 2022',
      to: '04 de fevereiro de 2022'
    }

    expect(formattedPerson).to.be.deep.equal(expected)
  })
})