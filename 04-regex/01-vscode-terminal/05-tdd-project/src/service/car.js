'use strict';
'use strict';
'use strict';
const Tax = require('../entities/tax')
const Transaction = require('../entities/transaction')
const BaseRepository = require('../repository/base')

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars })
    this.taxesBasedOnAge = Tax.taxesBasedOnAge
    this.currencyFormat = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  getRandomPositionFromArray(list) {
    const listLength = list.length

    return Math.floor(Math.random() * listLength)
  }

  chooseRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds)
    return carCategory.carIds[randomCarIndex]
  }

  async getAvailableCar(carCategory) {
    const carId = this.chooseRandomCar(carCategory)
    return await this.carRepository.find(carId)
  }

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer
    const { price } = carCategory
    const { then: tax } = this.taxesBasedOnAge.find((tax) => age >= tax.from && age <= tax.to)

    const finalPrice = ((tax * price) * numberOfDays)
    const formattedPrice = this.currencyFormat.format(finalPrice)

    return formattedPrice
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory)
    const finalPrice = this.calculateFinalPrice(customer, carCategory, numberOfDays)

    const today = new Date()
    today.setDate(today.getDate() + numberOfDays)

    const dueDate = today.toLocaleDateString('pt-br',{
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return new Transaction({
      customer,
      dueDate,
      car,
      amount: finalPrice
    })
  }
}

module.exports = CarService