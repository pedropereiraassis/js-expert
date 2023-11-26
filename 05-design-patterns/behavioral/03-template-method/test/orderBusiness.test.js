import { describe, expect, test, jest, beforeEach } from '@jest/globals'
import Order from '../src/entities/order.js'
import OrderBusiness from '../src/business/orderBusiness.js'

describe('Test suite for Template Method design pattern', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('OrderBusiness', () => {
    test('executing Order Business without Template Method', () => {
      const order = new Order({
        customerId: 1,
        amount: 100000,
        products: [{ description: 'ferrari' }]
      })
      const orderBusiness = new OrderBusiness()
      // all devs must remember to follow at risk this execution flow
      // if anyone forgets to call the validation function may break all system
      const isValid = orderBusiness._validateRequiredFields(order)
      expect(isValid).toBeTruthy()

      const result = orderBusiness._create(order)
      expect(result).toBeTruthy()
    })
    test('executing Order Business with Template Method', () => {
      const order = new Order({
        customerId: 1,
        amount: 100000,
        products: [{ description: 'ferrari' }]
      })
      const orderBusiness = new OrderBusiness()
      const calledValidationFn = jest.spyOn(
        orderBusiness,
        orderBusiness._validateRequiredFields.name
      )
      const calledCreateFn = jest.spyOn(
        orderBusiness,
        orderBusiness._create.name
      )
      // with template method, the steps sequencies is always executed - avoids logic replication
      const result = orderBusiness.create(order)
      expect(result).toBeTruthy()
      expect(calledValidationFn).toHaveBeenCalled()
      expect(calledCreateFn).toHaveBeenCalled()
    })
  })
})